// Em: src/services/dashboard.service.ts
import { Op } from 'sequelize';
import InvoiceModel from '../database/models/invoice.model';
import ClientModel from '../database/models/client.model';
import DependentModel from '../database/models/dependent.model';
import DepositModel from '../database/models/deposit.model';
import WithdrawModel from '../database/models/withdraw.model';

class DashboardService {
  public static async getSummary() {
    // Usamos Promise.all para executar todas as buscas no banco de dados em paralelo,
    // o que é muito mais rápido do que fazer uma por uma.
    const [
      paid,
      pending,
      overdue,
      totalClients,
      totalDependents,
      totalDeposits,
      totalWithdraws,
    ] = await Promise.all([
      InvoiceModel.sum('amount', { where: { paid: true } }),
      InvoiceModel.sum('amount', { where: { paid: false, expiration: { [Op.gte]: new Date() } } }),
      InvoiceModel.sum('amount', { where: { paid: false, expiration: { [Op.lt]: new Date() } } }),
      ClientModel.count(),
      DependentModel.count(),
      DepositModel.sum('amount'),
      WithdrawModel.sum('amount'),
    ]);

    // Montamos o objeto de resposta final
    return {
      invoices: {
        paid: paid || 0,
        pending: pending || 0,
        overdue: overdue || 0,
      },
      totals: {
        clients: totalClients || 0,
        dependents: totalDependents || 0,
      },
      cashflow: {
        current: (totalDeposits || 0) - (totalWithdraws || 0),
      },
    };
  }
}

export default DashboardService;