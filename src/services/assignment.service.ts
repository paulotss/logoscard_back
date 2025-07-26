import AssignmentsModel from '../database/models/assignments.model';
import InvoiceModel from '../database/models/invoice.model';
import CustomError from '../utils/CustomError';
import UserService from './user.service';
import PagBankService from './pagBank.service';

class AssignmentService {
  public static async create(
    planId: number,
    userId: number,
    pagbankSubscriptionId: string,
    expiration: string,
  ) {
    await AssignmentsModel.create({
      expiration,
      planId,
      userId,
      pagbankSubscriptionId,
    });
    const result = await UserService.getOne(userId);
    return result;
  }

  public static async remove(assignmentId: number) {
    const result = await AssignmentsModel.destroy({
      where: { id: assignmentId },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async syncInvoices(assignmentId: number): Promise<void> {
    console.log(`[SYNC] Iniciando sincronização para o assignment ID: ${assignmentId}`);

    // 1. Buscar a assinatura no nosso banco de dados para encontrar o ID do PagBank.
    const assignment = await AssignmentsModel.findByPk(assignmentId);

    if (!assignment || !assignment.pagbankSubscriptionId) {
      console.error(`[SYNC] Assignment ${assignmentId} não encontrado ou não possui ID do PagBank.`);
      throw new CustomError('Assinatura não encontrada ou não integrada com o PagBank.', 404);
    }

    const { pagbankSubscriptionId } = assignment;
    console.log(`[SYNC] ID da assinatura no PagBank: ${pagbankSubscriptionId}`);

    // 2. Chamar o PagBank para buscar o status MAIS ATUAL de todas as faturas.
    // Usamos o método que já existe no PagBankService.
    const pagbankInvoicesResponse = await PagBankService.getInvoices(pagbankSubscriptionId);
    const pagbankInvoices = pagbankInvoicesResponse.invoices || [];
    
    if (pagbankInvoices.length === 0) {
      console.log('[SYNC] Nenhuma fatura encontrada no PagBank para esta assinatura.');
      return; // Nenhuma fatura para sincronizar
    }

    console.log(`[SYNC] ${pagbankInvoices.length} faturas encontradas no PagBank.`);

    // 3. Buscar todas as nossas faturas internas que ainda estão pendentes para essa assinatura.
    const internalPendingInvoices = await InvoiceModel.findAll({
      where: {
        pagbankSubscriptionId,
        paid: false,
      },
      order: [['expiration', 'ASC']],
    });

    if (internalPendingInvoices.length === 0) {
      console.log('[SYNC] Todas as faturas internas já estão pagas.');
      return; // Nada a fazer
    }

    // 4. Comparar e Atualizar (O CORAÇÃO DA LÓGICA)
    for (const pagbankInvoice of pagbankInvoices) {
      // Nos importamos apenas com as faturas que o PagBank diz que foram PAGAS
      if (pagbankInvoice.status === 'PAID') {
        // Encontra a fatura interna correspondente.
        // A forma mais segura é pela "ocorrência", que é o número da parcela (1ª, 2ª, etc.).
        // Como nossas faturas internas estão ordenadas por data, a primeira da lista
        // corresponde à ocorrência mais antiga.
        const occurrenceIndex = pagbankInvoice.occurrence - 1;
        const matchingInternalInvoice = internalPendingInvoices[occurrenceIndex];

        if (matchingInternalInvoice) {
          console.log(`[SYNC] Fatura do PagBank (ocorrência ${pagbankInvoice.occurrence}) está PAGA. Atualizando fatura interna ID: ${matchingInternalInvoice.id}`);
          // Atualiza o status da nossa fatura interna para PAGA
          await matchingInternalInvoice.update({ paid: true });
        }
      }
    }

    console.log(`[SYNC] Sincronização para o assignment ID: ${assignmentId} concluída.`);
  }
}

export default AssignmentService;
