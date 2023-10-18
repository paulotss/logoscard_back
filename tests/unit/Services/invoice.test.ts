import { expect } from 'chai';
import Sinon from 'sinon';
import InvoiceModel from '../../../src/database/models/invoice.model';
import InvoiceSercice from '../../../src/services/invoice.service';

describe('Testes para invoices service', () => {
  it('Deveria listar uma fatura com id válido', async () => {
    // Arrange
    const response = {
      id: 1,
      amount: 50,
      expiration: '1995-12-17T00:00:00.000Z',
      paid: true,
      method: 'PIX',
      userId: 1,
    };
    const id = 1;
    Sinon.stub(InvoiceModel, 'findByPk').resolves(response as InvoiceModel);

    // Act
    const service = new InvoiceSercice();
    const result = await service.getById(id);

    // Assert
    expect(result).to.be.deep.equal(response);
  });
});
