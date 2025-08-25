-- Fix Aaron Sloan's approval timestamp
UPDATE financial_advisors 
SET approved_at = NOW() 
WHERE slug = 'aaron-sloan' AND approved_at IS NULL;