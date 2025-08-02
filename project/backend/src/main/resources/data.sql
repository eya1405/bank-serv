-- Insert demo user
INSERT INTO users (first_name, last_name, email, password) VALUES
    ('Karim', 'Benali', 'demo@banquex.com', '$2a$12$mrtCItuXcAnNKolPNuMI/OTG.L1WBIO/QnAh6WdVqxLMQA.jWaHiW');

-- Insert demo accounts
INSERT INTO accounts (account_number, type, balance, user_id) VALUES
                                                                  ('****1234', 'COURANT', 9200.00, 1),
                                                                  ('****5678', 'EPARGNE', 3200.00, 1);

-- Insert demo transactions
INSERT INTO transactions (date, amount, type, description, account_id) VALUES
                                                                           ('2025-01-08 10:30:00', -50.00, 'DEBIT', 'Retrait GAB', 1),
                                                                           ('2025-01-07 14:15:00', 500.00, 'CREDIT', 'Virement reçu', 1),
                                                                           ('2025-01-05 09:45:00', -100.00, 'DEBIT', 'Paiement carte', 1),
                                                                           ('2025-01-04 16:20:00', -100.00, 'DEBIT', 'Débit automatique', 2),
                                                                           ('2025-01-03 11:10:00', 1000.00, 'CREDIT', 'Salaire', 1),
                                                                           ('2025-01-02 08:30:00', -25.00, 'DEBIT', 'Frais bancaires', 1);