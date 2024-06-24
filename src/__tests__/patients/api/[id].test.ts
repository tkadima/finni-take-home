import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/patients/[id]';
import { getDb } from '../../../database';

jest.mock('../../../database');

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

    expect(dbMock.all).toHaveBeenCalledWith('DELETE FROM patients WHERE id = 1');
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

  it('should add an address to an existing patient on PUT', async () => {
    const req = {
      method: 'PUT',
      query: { id: '2' },
      body: {
        firstName: 'Jane',
        middleName: '',
        lastName: 'Doe',
        dob: '1992-02-02',
        status: 'Active',
        addresses: [{ street: '456 Elm St', city: 'Othertown' }],
        fields: {},
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
        'Jane',
        '',
        'Doe',
        '1992-02-02',
        'Active',
        JSON.stringify([{ street: '456 Elm St', city: 'Othertown' }]),
        JSON.stringify({}),
        '2',
      ]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: '2',
      firstName: 'Jane',
      middleName: '',
      lastName: 'Doe',
      dob: '1992-02-02',
      status: 'Active',
      addresses: [{ street: '456 Elm St', city: 'Othertown' }],
      fields: {},
    });
  });

  it('should update an address of an existing patient on PUT', async () => {
    const req = {
      method: 'PUT',
      query: { id: '3' },
      body: {
        firstName: 'Alice',
        middleName: 'B',
        lastName: 'Smith',
        dob: '1985-05-05',
        status: 'Inactive',
        addresses: [{ street: '789 Oak St', city: 'Newtown' }],
        fields: { notes: 'Updated notes' },
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
        'Alice',
        'B',
        'Smith',
        '1985-05-05',
        'Inactive',
        JSON.stringify([{ street: '789 Oak St', city: 'Newtown' }]),
        JSON.stringify({ notes: 'Updated notes' }),
        '3',
      ]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: '3',
      firstName: 'Alice',
      middleName: 'B',
      lastName: 'Smith',
      dob: '1985-05-05',
      status: 'Inactive',
      addresses: [{ street: '789 Oak St', city: 'Newtown' }],
      fields: { notes: 'Updated notes' },
    });
  });

  it('should create a new address for an existing patient on PUT', async () => {
    const req = {
      method: 'PUT',
      query: { id: '4' },
      body: {
        firstName: 'Bob',
        middleName: 'C',
        lastName: 'Johnson',
        dob: '1970-07-07',
        status: 'Inquiry',
        addresses: [{ street: '101 Pine St', city: 'Oldtown' }],
        fields: {},
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
        'Bob',
        'C',
        'Johnson',
        '1970-07-07',
        'Inquiry',
        JSON.stringify([{ street: '101 Pine St', city: 'Oldtown' }]),
        JSON.stringify({}),
        '4',
      ]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: '4',
      firstName: 'Bob',
      middleName: 'C',
      lastName: 'Johnson',
      dob: '1970-07-07',
      status: 'Inquiry',
      addresses: [{ street: '101 Pine St', city: 'Oldtown' }],
      fields: {},
    });
  });

  it('should create a new field for an existing patient on PUT', async () => {
    const req = {
      method: 'PUT',
      query: { id: '5' },
      body: {
        firstName: 'Charlie',
        middleName: 'D',
        lastName: 'Brown',
        dob: '1960-06-06',
        status: 'Active',
        addresses: [],
        fields: { newField: 'New field value' },
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
        'Charlie',
        'D',
        'Brown',
        '1960-06-06',
        'Active',
        JSON.stringify([]),
        JSON.stringify({ newField: 'New field value' }),
        '5',
      ]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: '5',
      firstName: 'Charlie',
      middleName: 'D',
      lastName: 'Brown',
      dob: '1960-06-06',
      status: 'Active',
      addresses: [],
      fields: { newField: 'New field value' },
    });
  });

  it('should update an existing field for an existing patient on PUT', async () => {
    const req = {
      method: 'PUT',
      query: { id: '6' },
      body: {
        firstName: 'Daniel',
        middleName: 'E',
        lastName: 'Green',
        dob: '1975-05-05',
        status: 'Inactive',
        addresses: [],
        fields: { existingField: 'Updated field value' },
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
        'Daniel',
        'E',
        'Green',
        '1975-05-05',
        'Inactive',
        JSON.stringify([]),
        JSON.stringify({ existingField: 'Updated field value' }),
        '6',
      ]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: '6',
      firstName: 'Daniel',
      middleName: 'E',
      lastName: 'Green',
      dob: '1975-05-05',
      status: 'Inactive',
      addresses: [],
      fields: { existingField: 'Updated field value' },
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
        addresses: [],
        fields: {}, // Empty fields indicate deletion
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
        'Eve',
        'F',
        'White',
        '1980-08-08',
        'Active',
        JSON.stringify([]),
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
