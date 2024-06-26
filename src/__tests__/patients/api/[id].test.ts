import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/patients/[id]';
import { getDb } from '../../../database';

jest.mock('../../../database');

describe('API endpoint /api/patient/[id]', () => {
  let dbMock: any;

  beforeEach(() => {
    dbMock = {
      run: jest.fn(),
      all: jest.fn(),
    };
    (getDb as jest.Mock).mockResolvedValue(dbMock);
  });

  it('should update patient addresses and additional_fields on PUT', async () => {
    const req = {
      method: 'PUT',
      query: { id: '1' },
      body: {
        firstName: 'John',
        middleName: 'D',
        lastName: 'Doe',
        dob: '1990-01-01',
        status: 'Active',
        primaryPhoneNumber: '123-456-7890',
        secondaryPhoneNumber: '098-765-4321',
        addresses: [{ street: '123 Main St', city: 'Anytown', zip: '12345' }],
        fields: { field1: 'value1' },
      },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(dbMock.run).toHaveBeenCalledWith(
      'UPDATE patients SET first_name = ?, middle_name = ?, last_name = ?, date_of_birth = ?, status = ?, addresses = ?, phone_numbers = ?, additional_fields = ? WHERE id = ?',
      [
        'John',
        'D',
        'Doe',
        '1990-01-01',
        'Active',
        JSON.stringify([
          { street: '123 Main St', city: 'Anytown', zip: '12345' },
        ]),
        JSON.stringify(['123-456-7890', '098-765-4321']),
        JSON.stringify({ field1: 'value1' }),
        '1',
      ]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: '1',
      firstName: 'John',
      middleName: 'D',
      lastName: 'Doe',
      dob: '1990-01-01',
      status: 'Active',
      primaryPhoneNumber: '123-456-7890',
      secondaryPhoneNumber: '098-765-4321',
      addresses: [{ street: '123 Main St', city: 'Anytown', zip: '12345' }],
      fields: { field1: 'value1' },
    });
  });

  it('should delete a field for an existing patient on PUT', async () => {
    const req = {
      method: 'PUT',
      query: { id: '7' },
      body: {
        firstName: 'Eve',
        middleName: 'F',
        lastName: 'White',
        dob: '1980-08-08',
        status: 'Active',
        primaryPhoneNumber: '432-2341-1000',
        addresses: [],
        fields: {}, // Empty fields indicate deletion
      },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(dbMock.run).toHaveBeenCalledWith(
      'UPDATE patients SET first_name = ?, middle_name = ?, last_name = ?, date_of_birth = ?, status = ?, addresses = ?, phone_numbers = ?, additional_fields = ? WHERE id = ?',
      [
        'Eve',
        'F',
        'White',
        '1980-08-08',
        'Active',
        JSON.stringify([]),
        JSON.stringify(['432-2341-1000']),
        JSON.stringify({}),
        '7',
      ]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: '7',
      firstName: 'Eve',
      middleName: 'F',
      lastName: 'White',
      dob: '1980-08-08',
      status: 'Active',
      addresses: [],
      primaryPhoneNumber: '432-2341-1000',
      fields: {},
    });
  });

  it('should return 405 if method is not allowed', async () => {
    const req = { method: 'GET' } as unknown as NextApiRequest;

    const setHeader = jest.fn();
    const end = jest.fn();
    const status = jest.fn(() => ({ end }));
    const res = { setHeader, status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(setHeader).toHaveBeenCalledWith('Allow', ['PUT', 'DELETE']);
    expect(status).toHaveBeenCalledWith(405);
    expect(end).toHaveBeenCalledWith('Method GET Not Allowed');
  });
});
