import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/patients/index';
import { getDb } from '../../database';

jest.mock('../../database');

describe('/api/patients', () => {
  let dbMock: any;

  beforeAll(() => {
    dbMock = {
      all: jest.fn(),
      run: jest.fn(),
    };
    (getDb as jest.Mock).mockResolvedValue(dbMock);
  });

  it('should return a list of patients on GET', async () => {
    const patients = [
      { id: '1', firstName: 'John', lastName: 'Doe' },
      { id: '2', firstName: 'Jane', lastName: 'Doe' },
    ];
    dbMock.all.mockResolvedValue(patients);

    const req = { method: 'GET' } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(dbMock.all).toHaveBeenCalledWith('SELECT * FROM patients');
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(patients);
  });

  it('should create a new patient on POST', async () => {
    dbMock.run.mockResolvedValue({ lastID: 3 });

    const req = {
      method: 'POST',
      body: {
        firstName: 'Sam',
        middleName: 'A',
        lastName: 'Smith',
        dob: '1990-01-01',
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
      INSERT INTO patients (
        first_name, middle_name, last_name, date_of_birth, status, addresses, additional_fields
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        'Sam',
        'A',
        'Smith',
        '1990-01-01',
        'Active',
        JSON.stringify([{ street: '123 Main St', city: 'Anytown' }]),
        JSON.stringify({ notes: 'Some notes' }),
      ]
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      id: 3,
      firstName: 'Sam',
      middleName: 'A',
      lastName: 'Smith',
      dob: '1990-01-01',
      status: 'Active',
      addresses: [{ street: '123 Main St', city: 'Anytown' }],
      fields: { notes: 'Some notes' },
    });
  });
});
