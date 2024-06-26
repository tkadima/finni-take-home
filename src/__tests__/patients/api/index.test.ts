import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/patients/index';
import { getDb } from '../../../database';

jest.mock('../../../database');

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
        primaryPhoneNumber: '652-234-2311',
        addresses: [
          {
            addressLine1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipcode: '12345',
          },
        ],
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
        first_name, middle_name, last_name, date_of_birth, status, addresses, phone_numbers, additional_fields
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        'Sam',
        'A',
        'Smith',
        '1990-01-01',
        'Active',
        JSON.stringify([
          {
            addressLine1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipcode: '12345',
          },
        ]),
        JSON.stringify(['652-234-2311']),
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
      addresses: [
        {
          addressLine1: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipcode: '12345',
        },
      ],
      primaryPhoneNumber: '652-234-2311',
      fields: { notes: 'Some notes' },
    });
  });

  it('should return 400 if required fields are missing in POST', async () => {
    const req = {
      method: 'POST',
      body: {
        middleName: 'A',
        lastName: 'Smith',
        dob: '1990-01-01',
        status: 'Active',
        addresses: [
          {
            addressLine1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipcode: '12345',
          },
        ],
        fields: { notes: 'Some notes' },
      },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'Required fields are missing',
    });
  });

  it('should return 400 if there is no address in POST', async () => {
    const req = {
      method: 'POST',
      body: {
        firstName: 'Sam',
        middleName: 'A',
        lastName: 'Smith',
        dob: '1990-01-01',
        status: 'Active',
        addresses: [],
        primaryPhoneNumber: '652-234-2311',
        fields: { notes: 'Some notes' },
      },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'At least one address is required',
    });
  });

  it('should return 400 if required address fields are missing in POST', async () => {
    const req = {
      method: 'POST',
      body: {
        firstName: 'Sam',
        middleName: 'A',
        lastName: 'Smith',
        dob: '1990-01-01',
        status: 'Active',
        addresses: [
          { addressLine1: '123 Main St', city: 'Anytown', state: 'CA' },
        ], // Missing zipcode
        primaryPhoneNumber: '652-234-2311',
        fields: { notes: 'Some notes' },
      },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'Required address fields are missing',
    });
  });

  it('should return 400 if additional_fields has empty keys in POST', async () => {
    const req = {
      method: 'POST',
      body: {
        firstName: 'Sam',
        middleName: 'A',
        lastName: 'Smith',
        dob: '1990-01-01',
        status: 'Active',
        addresses: [
          {
            addressLine1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipcode: '12345',
          },
        ],
        primaryPhoneNumber: '652-234-2311',
        fields: { '': 'Some value' }, // Empty key
      },
    } as unknown as NextApiRequest;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'Keys in additional_fields cannot be empty',
    });
  });

  it('should return 405 if method is not allowed', async () => {
    const req = { method: 'DELETE' } as unknown as NextApiRequest;

    const setHeader = jest.fn();
    const end = jest.fn();
    const status = jest.fn(() => ({ end }));
    const res = { setHeader, status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(setHeader).toHaveBeenCalledWith('Allow', ['GET', 'POST']);
    expect(status).toHaveBeenCalledWith(405);
    expect(end).toHaveBeenCalledWith('Method DELETE Not Allowed');
  });
});
