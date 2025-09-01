import InvoiceModel from '../database/models/invoice.model';
import PagBankService from './pagBank.service';

class SyncService {
  public static async syncInvoicesBySubscriptionId(
    pagbankSubscriptionId: string,
  ) {
    console.log(
      `[SYNC] Iniciando sincronização para a assinatura ID: ${pagbankSubscriptionId}`,
    );

    // 1. Usa o ID recebido para buscar a lista de faturas na API do PagBank.
    const pagbankInvoicesResponse = (await PagBankService.getInvoices(
      pagbankSubscriptionId,
    )) as any; // TODO: refatorar a tipagem de resposta
    const pagbankInvoices = pagbankInvoicesResponse.invoices || [];

    if (pagbankInvoices.length === 0) {
      console.log(
        `[SYNC] Nenhuma fatura encontrada no PagBank para a assinatura ${pagbankSubscriptionId}.`,
      );
      return { updatedCount: 0, updatedInvoiceIds: [] };
    }

    // 2. Filtra apenas as faturas que o PagBank marcou como PAGAS.
    const paidPagbankInvoices = pagbankInvoices.filter(
      (inv: any) => inv.status === 'PAID',
    );
    if (paidPagbankInvoices.length === 0) {
      console.log(
        `[SYNC] Nenhuma fatura PAGA encontrada no PagBank para a assinatura ${pagbankSubscriptionId}.`,
      );
      return { updatedCount: 0, updatedInvoiceIds: [] };
    }

    // 3. Extrai o número da "ocorrência" (parcela) de cada fatura paga.
    const paidOccurrences = paidPagbankInvoices.map(
      (inv: any) => inv.occurrence,
    );
    console.log(
      `[SYNC] Ocorrências pagas no PagBank: ${paidOccurrences.join(', ')}`,
    );

    // 4. Busca no nosso BD todas as faturas desta assinatura que AINDA estão como NÃO PAGAS.
    const internalPendingInvoices = await InvoiceModel.findAll({
      where: { pagbankSubscriptionId, paid: false },
      order: [['expiration', 'ASC']],
    });

    const updatedInvoices = [];

    // 5. Compara as listas e atualiza as faturas correspondentes.
    for (let i = 0; i < internalPendingInvoices.length; i++) {
      const internalInvoice = internalPendingInvoices[i];
      const totalInvoicesInDb = await InvoiceModel.count({
        where: { pagbankSubscriptionId },
      });
      const paidInvoicesInDb =
        totalInvoicesInDb - internalPendingInvoices.length;
      const currentOccurrence = paidInvoicesInDb + i + 1;

      if (paidOccurrences.includes(currentOccurrence)) {
        console.log(
          `[SYNC] Marcando fatura interna ID ${internalInvoice.id} (ocorrência ${currentOccurrence}) como paga.`,
        );
        await internalInvoice.update({ paid: true });
        updatedInvoices.push(internalInvoice.id);
      }
    }

    console.log(
      `[SYNC] Sincronização concluída. ${updatedInvoices.length} faturas atualizadas.`,
    );
    return {
      updatedCount: updatedInvoices.length,
      updatedInvoiceIds: updatedInvoices,
    };
  }
}

export default SyncService;
