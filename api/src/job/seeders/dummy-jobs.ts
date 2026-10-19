import { PaymentType } from '@labour-hiring/enums';

/**
 * Seed data: building, electrical wiring and carpentry jobs.
 * Pay is in Naira (FIXED = per month, HOURLY = per hour).
 */
export const dummyJobs = [
  // ───────────── Building & Masonry ─────────────
  {
    title: 'Bricklayer / Block Layer',
    companyName: 'Arewa Builders Ltd',
    description:
      'Lay sandcrete blocks and bricks for residential building walls, following plans and keeping lines, levels and plumb accurate.',
    location: 'Zaria, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '90000',
    maxPay: '150000',
    minExperienceYears: 2,
    skills: ['Bricklaying', 'Block Laying', 'Mortar Mixing', 'Plumb and Level'],
  },
  {
    title: 'Mason (Foundation & Concrete Works)',
    companyName: 'Northern Star Construction',
    description:
      'Prepare foundations, mix and pour concrete, and finish columns, beams and slabs on a new 4-bedroom duplex project.',
    location: 'Kaduna, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '110000',
    maxPay: '180000',
    minExperienceYears: 3,
    skills: ['Concrete Works', 'Foundation', 'Formwork', 'Reading Plans'],
  },
  {
    title: 'Plasterer / Renderer',
    companyName: 'Kaduna Prime Properties',
    description:
      'Apply smooth cement plaster and sand finish to interior and exterior walls on residential and commercial projects.',
    location: 'Kaduna, Kaduna',
    paymentType: PaymentType.HOURLY,
    minPay: '1500',
    maxPay: '2500',
    minExperienceYears: 2,
    skills: ['Plastering', 'Rendering', 'Screeding', 'Surface Preparation'],
  },
  {
    title: 'Floor and Wall Tiler',
    companyName: 'Glossy Interiors Nigeria',
    description:
      'Install floor and wall tiles in bathrooms, kitchens and living areas. Must cut tiles accurately and finish with clean grouting.',
    location: 'Abuja, FCT',
    paymentType: PaymentType.HOURLY,
    minPay: '2000',
    maxPay: '3500',
    minExperienceYears: 2,
    skills: ['Tiling', 'Grouting', 'Tile Cutting', 'Waterproofing'],
  },
  {
    title: 'Steel Fixer (Iron Bender)',
    companyName: 'Sahel Engineering Works',
    description:
      'Cut, bend and tie reinforcement bars for columns, beams and slabs according to structural drawings.',
    location: 'Kano, Kano',
    paymentType: PaymentType.FIXED,
    minPay: '100000',
    maxPay: '170000',
    minExperienceYears: 2,
    skills: ['Steel Fixing', 'Bar Bending', 'Reading Structural Drawings'],
  },
  {
    title: 'Scaffolder',
    companyName: 'Highrise Access Services',
    description:
      'Erect, adjust and dismantle scaffolding on multi-storey building sites, following safety standards at all times.',
    location: 'Lagos, Lagos',
    paymentType: PaymentType.FIXED,
    minPay: '120000',
    maxPay: '190000',
    minExperienceYears: 1,
    skills: ['Scaffolding', 'Site Safety', 'Working at Height'],
  },
  {
    title: 'Roofer (Long-span & Aluminium Sheets)',
    companyName: 'TopCover Roofing Ltd',
    description:
      'Install roof trusses and long-span aluminium roofing sheets, including ridge caps, flashing and gutters on new houses.',
    location: 'Kaduna, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '110000',
    maxPay: '190000',
    minExperienceYears: 3,
    skills: ['Roofing', 'Roof Trusses', 'Aluminium Sheets', 'Gutter Fitting'],
  },
  {
    title: 'POP Ceiling Installer',
    companyName: 'Elegant Ceilings & Interiors',
    description:
      'Install and finish POP and PVC ceilings, including cornices and decorative designs, for homes, offices and churches.',
    location: 'Abuja, FCT',
    paymentType: PaymentType.HOURLY,
    minPay: '2000',
    maxPay: '4000',
    minExperienceYears: 2,
    skills: ['POP Ceiling', 'PVC Ceiling', 'Cornice Work', 'Finishing'],
  },
  {
    title: 'Painter and Decorator',
    companyName: 'ColorPro Finishing',
    description:
      'Prepare surfaces and apply primer, emulsion and gloss paint to interior and exterior walls with a clean, even finish.',
    location: 'Zaria, Kaduna',
    paymentType: PaymentType.HOURLY,
    minPay: '1200',
    maxPay: '2200',
    minExperienceYears: 1,
    skills: ['Painting', 'Surface Preparation', 'Wall Finishing', 'Colour Matching'],
  },
  {
    title: 'Site Foreman (Residential Buildings)',
    companyName: 'Arewa Builders Ltd',
    description:
      'Supervise bricklayers, carpenters and general labourers on site, track materials and progress, and make sure work follows the drawings.',
    location: 'Zaria, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '200000',
    maxPay: '320000',
    minExperienceYears: 6,
    skills: ['Site Supervision', 'Reading Plans', 'Team Management', 'Quality Control'],
  },
  {
    title: 'General Building Labourer',
    companyName: 'Northern Star Construction',
    description:
      'Assist tradesmen on site: carry and mix materials, clean up, dig trenches and help with general building tasks.',
    location: 'Kaduna, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '55000',
    maxPay: '80000',
    minExperienceYears: 0,
    skills: ['Manual Labour', 'Mixing Cement', 'Site Cleaning', 'Teamwork'],
  },

  // ───────────── Electrical Wiring ─────────────
  {
    title: 'Residential Electrician (House Wiring)',
    companyName: 'BrightWire Electricals',
    description:
      'Carry out conduit and cable installation, socket and switch fitting, and distribution board connections in new residential buildings.',
    location: 'Abuja, FCT',
    paymentType: PaymentType.FIXED,
    minPay: '120000',
    maxPay: '200000',
    minExperienceYears: 3,
    skills: ['House Wiring', 'Conduit Installation', 'Distribution Boards', 'Fault Finding'],
  },
  {
    title: 'Electrical Wiring Apprentice',
    companyName: 'BrightWire Electricals',
    description:
      'Learn on the job while helping senior electricians with pulling cables, fixing conduits, and installing sockets and light fittings.',
    location: 'Kaduna, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '50000',
    maxPay: '75000',
    minExperienceYears: 0,
    skills: ['Basic Wiring', 'Hand Tools', 'Willingness to Learn'],
  },
  {
    title: 'Commercial Electrician',
    companyName: 'PowerGrid Installations',
    description:
      'Install and test lighting, power circuits and cable trays in offices, shops and plazas, following IEE wiring regulations.',
    location: 'Lagos, Lagos',
    paymentType: PaymentType.FIXED,
    minPay: '180000',
    maxPay: '300000',
    minExperienceYears: 4,
    skills: ['Commercial Wiring', 'Cable Trays', 'Circuit Testing', 'IEE Regulations'],
  },
  {
    title: 'Solar and Inverter Installer',
    companyName: 'SunRise Energy Solutions',
    description:
      'Install solar panels, inverters and battery banks for homes and businesses, including wiring, earthing and system testing.',
    location: 'Kano, Kano',
    paymentType: PaymentType.FIXED,
    minPay: '150000',
    maxPay: '260000',
    minExperienceYears: 2,
    skills: ['Solar Installation', 'Inverter Wiring', 'Battery Banks', 'Earthing'],
  },
  {
    title: 'Electrician (Maintenance & Repairs)',
    companyName: 'Zaria Property Management',
    description:
      'Diagnose and repair faults in wiring, sockets, breakers and lighting across rental apartments. Respond to call-outs promptly.',
    location: 'Zaria, Kaduna',
    paymentType: PaymentType.HOURLY,
    minPay: '2000',
    maxPay: '3500',
    minExperienceYears: 3,
    skills: ['Fault Finding', 'Breaker Replacement', 'Lighting Repair', 'Customer Service'],
  },
  {
    title: 'Electrical Foreman',
    companyName: 'PowerGrid Installations',
    description:
      'Lead a team of electricians on estate projects, plan cable routes, inspect completed work and sign off installations.',
    location: 'Abuja, FCT',
    paymentType: PaymentType.FIXED,
    minPay: '250000',
    maxPay: '400000',
    minExperienceYears: 7,
    skills: ['Team Leadership', 'Electrical Inspection', 'Cable Planning', 'Safety Compliance'],
  },
  {
    title: 'Generator and Change-over Wiring Technician',
    companyName: 'Standby Power Services',
    description:
      'Install generator change-over switches and wiring for homes and shops, and connect backup power safely to the mains.',
    location: 'Kaduna, Kaduna',
    paymentType: PaymentType.HOURLY,
    minPay: '2500',
    maxPay: '4500',
    minExperienceYears: 3,
    skills: ['Change-over Switch', 'Generator Wiring', 'Load Calculation', 'Safety'],
  },

  // ───────────── Carpentry & Joinery ─────────────
  {
    title: 'Carpenter (Roof Trusses & Formwork)',
    companyName: 'Northern Star Construction',
    description:
      'Build timber formwork for slabs and beams, and cut and assemble wooden roof trusses on residential building sites.',
    location: 'Kaduna, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '100000',
    maxPay: '170000',
    minExperienceYears: 3,
    skills: ['Formwork', 'Roof Trusses', 'Timber Cutting', 'Reading Plans'],
  },
  {
    title: 'Furniture Carpenter',
    companyName: 'WoodCraft Furniture Works',
    description:
      'Make beds, wardrobes, chairs and tables from solid wood and board. Must produce neat joints and a smooth finish.',
    location: 'Zaria, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '80000',
    maxPay: '140000',
    minExperienceYears: 2,
    skills: ['Furniture Making', 'Wood Joints', 'Sanding', 'Varnishing'],
  },
  {
    title: 'Door and Window Joiner',
    companyName: 'Prime Joinery Ltd',
    description:
      'Fabricate and fit wooden doors, door frames and window frames, including hanging, hinges, locks and finishing.',
    location: 'Abuja, FCT',
    paymentType: PaymentType.HOURLY,
    minPay: '1800',
    maxPay: '3000',
    minExperienceYears: 2,
    skills: ['Door Fitting', 'Window Frames', 'Joinery', 'Hinges and Locks'],
  },
  {
    title: 'Kitchen Cabinet Maker',
    companyName: 'Elegant Interiors Nigeria',
    description:
      'Build and install fitted kitchen cabinets and wardrobes from MDF, plywood and laminates according to customer designs.',
    location: 'Lagos, Lagos',
    paymentType: PaymentType.FIXED,
    minPay: '130000',
    maxPay: '220000',
    minExperienceYears: 3,
    skills: ['Cabinet Making', 'MDF and Plywood', 'Laminate Finishing', 'Measuring'],
  },
  {
    title: 'Carpenter Assistant',
    companyName: 'WoodCraft Furniture Works',
    description:
      'Support carpenters by measuring and cutting timber, sanding, assembling parts and keeping the workshop clean and organised.',
    location: 'Zaria, Kaduna',
    paymentType: PaymentType.FIXED,
    minPay: '45000',
    maxPay: '70000',
    minExperienceYears: 0,
    skills: ['Sanding', 'Measuring', 'Hand Tools', 'Workshop Safety'],
  },
  {
    title: 'Wood Floor and Decking Installer',
    companyName: 'Prime Joinery Ltd',
    description:
      'Install timber and laminate flooring, skirting boards and outdoor decking in homes, hotels and offices.',
    location: 'Abuja, FCT',
    paymentType: PaymentType.HOURLY,
    minPay: '2000',
    maxPay: '3500',
    minExperienceYears: 2,
    skills: ['Wood Flooring', 'Decking', 'Skirting', 'Precision Cutting'],
  },
];
