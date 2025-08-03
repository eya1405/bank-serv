export interface Account {
  id: number;
  accountNumber: string;
  type: AccountType;
  balance: number;
  owner: string;
}

export enum AccountType {
  CHECKING = 'COURANT',
  SAVINGS = 'EPARGNE'
}

export interface Transaction {
  id: number;
  date: Date;
  amount: number;
  type: TransactionType;
  description: string;
  accountId: number;
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}