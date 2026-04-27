-- Skrip SQL ini untuk menambahkan sisa 5 data Tax Rates untuk masing-masing negara 
-- yang ada di Master Countries (Pakistan, Bangladesh, UAE, Qatar, United Kingdom).

INSERT INTO master_tax_rates (tax_code, tax_type, tax_name, country_code, country_name, tax_rate, description, is_active) 
VALUES
('VAT-PK-18', 'VAT', 'General Sales Tax Pakistan', 'PK', 'Pakistan', 18.00, 'Standar General Sales Tax (GST/VAT) di Pakistan sebesar 18%', true),
('VAT-BD-15', 'VAT', 'Value Added Tax Bangladesh', 'BD', 'Bangladesh', 15.00, 'Standar PPN/VAT di Bangladesh sebesar 15%', true),
('VAT-AE-5', 'VAT', 'Value Added Tax UAE', 'AE', 'United Arab Emirates', 5.00, 'Standar PPN/VAT di Uni Emirat Arab sebesar 5%', true),
('EXEMPT-QA', 'Exempt', 'Tax Exempt Qatar', 'QA', 'Qatar', 0.00, 'Qatar saat ini tidak menerapkan tarif PPN umum (Exempt / 0%)', true),
('VAT-GB-20', 'VAT', 'Value Added Tax UK', 'GB', 'United Kingdom', 20.00, 'Standar PPN/VAT di Inggris Raya (UK) sebesar 20%', true);
