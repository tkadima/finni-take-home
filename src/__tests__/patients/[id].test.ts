import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/patients/[id]';
import { getDb } from '../../database';

jest.mock('../../database');

describe('/api/patients/[id]', () => {
  let dbMock: any;

  beforeAll(() => {
    dbMock = {
      all: jest.fn(),
      run: jest.fn(),
    };
    (getDb as jest.Mock).mockResolvedValue(dbMock);
  });

  it('should delete a patient with a given ID on DELETE', async () => {
    const req = {
      method: 'DELETE',
      query: { id: '1' },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(dbMock.all).toHaveBeenCalledWith(
      'DELETE FROM patients WHERE id = 1'
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: 'Deleted patient with id 1' });
  });

  it('should return 500 if deletion fails', async () => {
    dbMock.all.mockImplementationOnce(() => {
      throw new Error('Deletion error');
    });

    const req = {
      method: 'DELETE',
      query: { id: '1' },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'Unable to delete patient with id 1',
      error: 'Deletion error',
    });
  });

  it('should update a patient on PUT', async () => {
    const req = {
      method: 'PUT',
      query: { id: '1' },
      body: {
        firstName: 'John',
        middleName: 'A',
        lastName: 'Doe',
        dob: '2000-01-01',
        status: 'Active',
        addresses: [{ street: '123 Main St', city: 'Anytown' }],
        fields: { notes: 'Some notes' },
      },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(dbMock.run).toHaveBeenCalledWith(
      `
      UPDATE patients
      SET first_name = ?, middle_name = ?, last_name = ?, date_of_birth = ?, status = ?, addresses = ?, additional_fields = ?
      WHERE id = ?
    `,
      [
        'John',
        'A',
        'Doe',
        '2000-01-01',
        'Active',
        JSON.stringify([{ street: '123 Main St', city: 'Anytown' }]),
        JSON.stringify({ notes: 'Some notes' }),
        '1',
      ]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: '1',
      firstName: 'John',
      middleName: 'A',
      lastName: 'Doe',
      dob: '2000-01-01',
      status: 'Active',
      addresses: [{ street: '123 Main St', city: 'Anytown' }],
      fields: { notes: 'Some notes' },
    });
  });
});
