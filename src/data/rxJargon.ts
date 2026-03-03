export interface JargonTerm {
  id: string;
  term: string;
  definition: string;
  category: 'liquidity' | 'capital-structure' | 'process' | 'legal' | 'valuation' | 'general';
  example?: string;
  relatedTerms?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const rxJargon: JargonTerm[] = [
  // Liquidity Terms
  {
    id: 'runway',
    term: 'Runway',
    definition: 'The number of weeks or months a company can operate before running out of cash, calculated by dividing available liquidity by weekly/monthly cash burn.',
    category: 'liquidity',
    example: 'With $5M in available liquidity and $400K weekly burn, the company has 12.5 weeks of runway.',
    relatedTerms: ['cash-burn', 'liquidity'],
    difficulty: 'beginner'
  },
  {
    id: 'cash-burn',
    term: 'Cash Burn',
    definition: 'The rate at which a company consumes cash, typically measured weekly or monthly. Negative operating cash flow.',
    category: 'liquidity',
    example: 'The retailer has $400K weekly cash burn due to operating losses and working capital needs.',
    relatedTerms: ['runway', 'operating-cash-flow'],
    difficulty: 'beginner'
  },
  {
    id: 'abl',
    term: 'ABL (Asset-Based Lending)',
    definition: 'A revolving credit facility secured by current assets (A/R, inventory). Availability fluctuates based on borrowing base calculations.',
    category: 'capital-structure',
    example: 'The company has an $8M ABL facility with $7.5M drawn, leaving only $500K available.',
    relatedTerms: ['revolver', 'borrowing-base', 'first-lien'],
    difficulty: 'intermediate'
  },
  {
    id: 'revolver',
    term: 'Revolver',
    definition: 'A revolving credit facility that can be drawn and repaid repeatedly, like a credit card. Often secured by assets.',
    category: 'capital-structure',
    example: 'The revolver has $10M capacity but $8M is drawn and $1M is blocked by letters of credit.',
    relatedTerms: ['abl', 'borrowing-base'],
    difficulty: 'beginner'
  },
  {
    id: 'borrowing-base',
    term: 'Borrowing Base',
    definition: 'The maximum amount that can be borrowed under an ABL facility, calculated as a percentage of eligible receivables and inventory.',
    category: 'capital-structure',
    example: 'Borrowing base = (85% × eligible A/R) + (50% × eligible inventory) - reserves.',
    relatedTerms: ['abl', 'revolver'],
    difficulty: 'intermediate'
  },
  {
    id: 'lc',
    term: 'Letters of Credit (L/C)',
    definition: 'Bank guarantees issued to suppliers that reduce revolver availability. Common for imports and large purchases.',
    category: 'liquidity',
    example: 'Outstanding letters of credit of $500K reduce the available revolver capacity.',
    relatedTerms: ['revolver', 'abl'],
    difficulty: 'intermediate'
  },
  {
    id: 'restricted-cash',
    term: 'Restricted Cash',
    definition: 'Cash on the balance sheet that cannot be used for operations, typically held for specific purposes (e.g., debt service reserves, escrow).',
    category: 'liquidity',
    example: 'Of the $5M cash balance, $1M is restricted for debt service, leaving $4M unrestricted.',
    relatedTerms: ['liquidity', 'cash-burn'],
    difficulty: 'beginner'
  },
  {
    id: 'dip',
    term: 'DIP Financing',
    definition: 'Debtor-in-Possession financing: super-priority loans provided to companies in Chapter 11 to fund operations during bankruptcy.',
    category: 'legal',
    example: 'The company secured a $10M DIP facility to fund operations through the Chapter 11 process.',
    relatedTerms: ['chapter-11', 'super-priority'],
    difficulty: 'advanced'
  },

  // Capital Structure Terms
  {
    id: 'fulcrum-security',
    term: 'Fulcrum Security',
    definition: 'The debt tranche where enterprise value runs out in a recovery analysis. This class typically converts to equity in a restructuring.',
    category: 'capital-structure',
    example: 'With $35M EV and $53M debt, the Term Loan is the fulcrum - it receives partial recovery and converts to equity.',
    relatedTerms: ['recovery', 'debt-for-equity', 'waterfall'],
    difficulty: 'advanced'
  },
  {
    id: 'waterfall',
    term: 'Waterfall / Recovery Analysis',
    definition: 'The priority order in which enterprise value is distributed to creditors, starting with senior secured and flowing down.',
    category: 'capital-structure',
    example: 'In the waterfall, the ABL recovers 100%, the Term Loan recovers 45%, and unsecured notes are wiped out.',
    relatedTerms: ['fulcrum-security', 'recovery', 'seniority'],
    difficulty: 'intermediate'
  },
  {
    id: 'first-lien',
    term: 'First Lien (1L)',
    definition: 'Senior secured debt with first priority claim on collateral. Typically ABL revolvers or senior term loans.',
    category: 'capital-structure',
    example: 'The $50M 1L Term Loan has first claim on all assets except ABL collateral.',
    relatedTerms: ['second-lien', 'security', 'seniority'],
    difficulty: 'beginner'
  },
  {
    id: 'second-lien',
    term: 'Second Lien (2L)',
    definition: 'Secured debt with secondary claim on collateral, behind first lien creditors. Higher risk, higher coupon.',
    category: 'capital-structure',
    example: 'The $25M 2L Term Loan is secured but subordinated to the 1L facility.',
    relatedTerms: ['first-lien', 'security', 'seniority'],
    difficulty: 'intermediate'
  },
  {
    id: 'unsecured',
    term: 'Unsecured Debt',
    definition: 'Debt with no collateral backing. Lowest priority in bankruptcy, often impaired in restructurings.',
    category: 'capital-structure',
    example: 'The $15M unsecured notes are out of the money and will likely receive equity in the restructuring.',
    relatedTerms: ['seniority', 'recovery'],
    difficulty: 'beginner'
  },
  {
    id: 'leverage-ratio',
    term: 'Leverage Ratio',
    definition: 'Total debt divided by EBITDA or enterprise value. Measures how indebted a company is relative to earnings or value.',
    category: 'valuation',
    example: 'With $53M debt and $35M EV, the company has 1.5x leverage (debt/EV). At >6x debt/EBITDA, it\'s highly leveraged.',
    relatedTerms: ['solvency', 'enterprise-value'],
    difficulty: 'beginner'
  },
  {
    id: 'enterprise-value',
    term: 'Enterprise Value (EV)',
    definition: 'The total value of a company\'s operations, typically estimated using EBITDA multiples from comparable companies.',
    category: 'valuation',
    example: 'At 5x LTM EBITDA of $7M, the enterprise value is approximately $35M.',
    relatedTerms: ['ebitda', 'market-cap', 'equity-value'],
    difficulty: 'intermediate'
  },
  {
    id: 'solvency',
    term: 'Solvency',
    definition: 'Whether a company\'s enterprise value exceeds its total debt. Insolvent = EV < Debt. Determines restructuring dynamics.',
    category: 'valuation',
    example: 'With $35M EV and $53M debt, the company is insolvent by $18M.',
    relatedTerms: ['enterprise-value', 'fulcrum-security'],
    difficulty: 'beginner'
  },

  // Process Terms
  {
    id: 'amend-extend',
    term: 'Amend & Extend (A&E)',
    definition: 'Out-of-court restructuring where lenders agree to amend covenants and extend maturity dates, often with higher fees/rates.',
    category: 'process',
    example: 'The company negotiated an A&E that extends the maturity by 2 years and loosens the leverage covenant.',
    relatedTerms: ['out-of-court', 'covenant'],
    difficulty: 'intermediate'
  },
  {
    id: 'debt-for-equity',
    term: 'Debt-for-Equity Swap (D4E)',
    definition: 'Restructuring technique where creditors exchange debt for equity ownership, reducing leverage and avoiding bankruptcy.',
    category: 'process',
    example: 'Junior lenders agreed to convert $20M of debt into 80% equity ownership of the reorganized company.',
    relatedTerms: ['fulcrum-security', 'out-of-court'],
    difficulty: 'intermediate'
  },
  {
    id: 'prepack',
    term: 'Pre-Packaged Chapter 11 (Prepack)',
    definition: 'Chapter 11 bankruptcy where the reorganization plan is negotiated and voted on BEFORE filing, minimizing time in court.',
    category: 'process',
    example: 'The company emerged from its prepackaged bankruptcy in just 45 days after securing creditor votes pre-filing.',
    relatedTerms: ['chapter-11', 'plan-of-reorganization'],
    difficulty: 'advanced'
  },
  {
    id: 'section-363',
    term: 'Section 363 Sale',
    definition: 'Bankruptcy auction process allowing sale of assets free and clear of liabilities. Often used for quick liquidations or acquisitions.',
    category: 'legal',
    example: 'The company sold its operating assets via Section 363 sale to a strategic buyer for $40M.',
    relatedTerms: ['chapter-11', 'stalking-horse'],
    difficulty: 'advanced'
  },
  {
    id: 'stalking-horse',
    term: 'Stalking Horse Bid',
    definition: 'Initial bid in a Section 363 auction that sets a floor price and terms. Bidder receives break-up fees if outbid.',
    category: 'legal',
    example: 'Private equity firm submitted a $35M stalking horse bid with a 3% break-up fee.',
    relatedTerms: ['section-363', 'overbid'],
    difficulty: 'advanced'
  },
  {
    id: 'chapter-11',
    term: 'Chapter 11',
    definition: 'U.S. bankruptcy code allowing companies to reorganize while protected from creditors. Can be consensual (prepack) or contested.',
    category: 'legal',
    example: 'The company filed Chapter 11 to implement a debt-for-equity swap opposed by junior creditors.',
    relatedTerms: ['automatic-stay', 'plan-of-reorganization', 'dip'],
    difficulty: 'beginner'
  },
  {
    id: 'chapter-7',
    term: 'Chapter 7',
    definition: 'Liquidation bankruptcy where a trustee sells all assets and distributes proceeds to creditors. Business ceases to exist.',
    category: 'legal',
    example: 'After failing to find a buyer, the retailer converted from Chapter 11 to Chapter 7 liquidation.',
    relatedTerms: ['chapter-11', 'liquidation'],
    difficulty: 'beginner'
  },
  {
    id: 'automatic-stay',
    term: 'Automatic Stay',
    definition: 'Upon Chapter 11 filing, all collection actions and lawsuits are immediately halted, giving the debtor breathing room.',
    category: 'legal',
    example: 'The automatic stay prevented the landlord from evicting the company from its stores.',
    relatedTerms: ['chapter-11', 'dip'],
    difficulty: 'intermediate'
  },

  // Advanced Terms
  {
    id: 'covenant',
    term: 'Covenant',
    definition: 'Financial or operational restrictions in loan agreements (e.g., max leverage, min liquidity). Violations trigger default.',
    category: 'capital-structure',
    example: 'The company violated its 6.0x leverage covenant, triggering an event of default.',
    relatedTerms: ['default', 'amend-extend'],
    difficulty: 'intermediate'
  },
  {
    id: 'make-whole',
    term: 'Make-Whole Premium',
    definition: 'Prepayment penalty compensating lenders for lost interest if debt is repaid early. Can be substantial.',
    category: 'capital-structure',
    example: 'Refinancing the bonds triggers a $5M make-whole premium, making it uneconomical.',
    relatedTerms: ['refinancing', 'call-protection'],
    difficulty: 'advanced'
  },
  {
    id: 'credit-bid',
    term: 'Credit Bid',
    definition: 'In a 363 sale, secured creditors can bid using their debt rather than cash, giving them an advantage in auctions.',
    category: 'legal',
    example: 'The Term Loan lenders credit bid their $50M claim to acquire the assets.',
    relatedTerms: ['section-363', 'secured'],
    difficulty: 'advanced'
  },
  {
    id: 'super-priority',
    term: 'Super-Priority',
    definition: 'DIP financing or administrative claims that rank ahead of all pre-petition debt in bankruptcy.',
    category: 'legal',
    example: 'The DIP facility has super-priority status, ensuring it gets paid before existing lenders.',
    relatedTerms: ['dip', 'administrative-claim'],
    difficulty: 'advanced'
  },
  {
    id: 'out-of-court',
    term: 'Out-of-Court Restructuring',
    definition: 'Debt restructuring negotiated directly with creditors without bankruptcy filing. Faster and cheaper but requires consensus.',
    category: 'process',
    example: 'The company completed an out-of-court restructuring in 6 weeks, avoiding Chapter 11 costs.',
    relatedTerms: ['amend-extend', 'debt-for-equity'],
    difficulty: 'beginner'
  },
  {
    id: 'plan-of-reorganization',
    term: 'Plan of Reorganization (POR)',
    definition: 'Legal document in Chapter 11 outlining how creditors will be treated and how the company will emerge from bankruptcy.',
    category: 'legal',
    example: 'The POR converts $30M of debt to equity and extends remaining debt by 3 years.',
    relatedTerms: ['chapter-11', 'disclosure-statement'],
    difficulty: 'advanced'
  },
  {
    id: 'maturity-wall',
    term: 'Maturity Wall',
    definition: 'Large amount of debt maturing in a short timeframe, creating refinancing risk if the company can\'t repay or extend.',
    category: 'capital-structure',
    example: 'The company faces a maturity wall with $100M in bonds due in 2026 and limited refinancing options.',
    relatedTerms: ['refinancing', 'amend-extend'],
    difficulty: 'intermediate'
  },
  {
    id: 'ytm',
    term: 'Yield to Maturity (YTM)',
    definition: 'The annual return an investor earns if they buy a bond at current price and hold to maturity. Implied by trading price.',
    category: 'valuation',
    example: 'A bond trading at 65¢ with 8% coupon and 3 years to maturity has ~20% YTM, signaling distress.',
    relatedTerms: ['trading-price', 'distressed'],
    difficulty: 'intermediate'
  },
  {
    id: 'trading-price',
    term: 'Trading Price',
    definition: 'The market price of debt as a percentage of par (100¢ = par). Prices below 80¢ typically signal distress.',
    category: 'valuation',
    example: 'The term loan trading at 65¢ suggests the market expects 35% impairment.',
    relatedTerms: ['par', 'distressed', 'recovery'],
    difficulty: 'beginner'
  },
  {
    id: 'par',
    term: 'Par Value',
    definition: 'The face value or principal amount of debt. "100¢ on the dollar" means full repayment.',
    category: 'capital-structure',
    example: 'The $50M term loan has $50M par value, but trades at 65¢ ($32.5M market value).',
    relatedTerms: ['trading-price', 'recovery'],
    difficulty: 'beginner'
  },
  {
    id: 'recovery',
    term: 'Recovery Rate',
    definition: 'The percentage of par value creditors expect to receive in a restructuring or liquidation.',
    category: 'valuation',
    example: 'First lien recovers 100%, second lien recovers 45%, unsecured notes recover 0%.',
    relatedTerms: ['waterfall', 'fulcrum-security', 'par'],
    difficulty: 'intermediate'
  },
  {
    id: 'distressed',
    term: 'Distressed',
    definition: 'A company or debt trading at prices indicating high probability of default or restructuring. Typically debt trading below 80¢.',
    category: 'general',
    example: 'The bonds trading at 50¢ are deeply distressed, pricing in significant impairment.',
    relatedTerms: ['trading-price', 'default'],
    difficulty: 'beginner'
  },
  {
    id: 'default',
    term: 'Default / Event of Default (EOD)',
    definition: 'Violation of debt agreement terms (missed payment, covenant breach). Gives lenders right to accelerate or foreclose.',
    category: 'general',
    example: 'Missing the interest payment triggered an event of default, allowing lenders to demand immediate repayment.',
    relatedTerms: ['covenant', 'acceleration'],
    difficulty: 'beginner'
  },
  {
    id: 'sofr',
    term: 'SOFR',
    definition: 'Secured Overnight Financing Rate - benchmark interest rate that replaced LIBOR. Debt often priced as "SOFR + spread".',
    category: 'capital-structure',
    example: 'The term loan pays SOFR + 550 bps (5.5%), so if SOFR is 4%, the all-in rate is 9.5%.',
    relatedTerms: ['spread', 'coupon'],
    difficulty: 'intermediate'
  }
];

// Helper functions
export const getJargonByCategory = (category: JargonTerm['category']): JargonTerm[] => {
  return rxJargon.filter(term => term.category === category);
};

export const getJargonById = (id: string): JargonTerm | undefined => {
  return rxJargon.find(term => term.id === id);
};

export const getJargonByTerm = (term: string): JargonTerm | undefined => {
  return rxJargon.find(t => t.term.toLowerCase() === term.toLowerCase());
};

export const searchJargon = (query: string): JargonTerm[] => {
  const lowerQuery = query.toLowerCase();
  return rxJargon.filter(term =>
    term.term.toLowerCase().includes(lowerQuery) ||
    term.definition.toLowerCase().includes(lowerQuery)
  );
};

export const getRelatedTerms = (termId: string): JargonTerm[] => {
  const term = getJargonById(termId);
  if (!term || !term.relatedTerms) return [];

  return term.relatedTerms
    .map(id => getJargonById(id))
    .filter((t): t is JargonTerm => t !== undefined);
};
