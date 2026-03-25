export const customers = [
  { id: 7419, type: 'person', taxId: 'MHMLM89P07Z236N', name: 'MUHAMMAD ASLAM', mobile: '3201133817' },
  { id: 7392, type: 'person', taxId: 'ZZASPN000267Z34H', name: 'SUFIAN AZIZ', mobile: '3880947940' },
  { id: 7372, type: 'person', taxId: 'SCHHMR02E52Z34H', name: 'HUMAIRA ASGHAR', mobile: '3272307213' },
  { id: 7360, type: 'person', taxId: 'MHMQSR94A01Z17RG', name: 'QAISAR MEHMOOD', mobile: '3479831503' },
  { id: 7347, type: 'person', taxId: 'HDRDNN91P22Z236F', name: 'ADNAN HAIDAR', mobile: '3501422742' },
  { id: 7331, type: 'person', taxId: 'RSLMHM86L28Z236U', name: 'MUHAMMAD ARSLAN', mobile: '3809311247' },
  { id: 7304, type: 'person', taxId: 'GTHNNK72T31Z225M', name: 'NAVEEN KUMAR GAUTAM', mobile: '3509147183' },
  { id: 7298, type: 'person', taxId: 'RRASMN80R07Z222P', name: 'SAMARJIT ARORA', mobile: '3508664509' },
  { id: 7201, type: 'person', taxId: 'SHTSHN571C0NZ236P', name: 'MALIK SHAHNAVAZ ASHRAF', mobile: '3983446292' },
  { id: 7195, type: 'person', taxId: 'SNGSMB84U08Z221', name: 'SATNAM SINGH', mobile: '3501298761' },
];

export const files = [
  { fileId: '8784431788', taxId: 'MHMLM89P07Z236N', customer: 'MUHAMMAD ASLAM', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', service: 'Disoccupazione Agricola', created: '2026-03-21 15:00:08', status: 'Completed' },
  { fileId: '8784431730', taxId: 'ZZASPN000267Z34H', customer: 'SUFIAN AZIZ', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', service: 'ESTRATTO CONTRIBUTIVO - ECOCERT', created: '2026-03-11 10:39:45', status: 'Completed' },
  { fileId: '8784431688', taxId: 'SCHHMR02E52Z34H', customer: 'HUMAIRA ASGHAR', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', service: 'DISOCCUPAZIONE', created: '2026-03-05 14:43:18', status: 'Completed' },
  { fileId: '8784431661', taxId: 'MHMQSR94A01Z17RG', customer: 'QAISAR MEHMOOD', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', service: 'Disoccupazione Agricola', created: '2026-03-03 10:07:18', status: 'Completed' },
  { fileId: '8784431632', taxId: 'HDRDNN91P22Z236F', customer: 'ADNAN HAIDAR', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', service: 'ESTRATTO CONTRIBUTIVO - ECOCERT', created: '2026-02-28 11:13:03', status: 'Completed' },
  { fileId: '8784431621', taxId: 'RSLMHM86L28Z236U', customer: 'MUHAMMAD ARSLAN', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', service: 'PERMESSO DI SOGGIORNO', created: '2026-02-27 09:22:15', status: 'Completed' },
];

export const movements = [
  { fileId: '8784431788', customerName: 'MUHAMMAD ASLAM', service: 'Disoccupazione Agricola', description: '', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', amount: 10 },
  { fileId: '8784431730', customerName: 'SUFIAN AZIZ', service: 'ESTRATTO CONTRIBUTIVO - ECOCERT', description: '', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', amount: 5 },
  { fileId: '8784431688', customerName: 'HUMAIRA ASGHAR', service: 'DISOCCUPAZIONE', description: '', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', amount: 0 },
  { fileId: '8784431661', customerName: 'QAISAR MEHMOOD', service: 'Disoccupazione Agricola', description: '', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', amount: 0 },
  { fileId: '8784431632', customerName: 'ADNAN HAIDAR', service: 'ESTRATTO CONTRIBUTIVO - ECOCERT', description: '', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', amount: 0 },
  { fileId: '8784431621', customerName: 'MUHAMMAD ARSLAN', service: 'PERMESSO DI SOGGIORNO', description: '', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', amount: 5 },
  { fileId: '8784431590', customerName: 'NAVEEN KUMAR GAUTAM', service: 'Disoccupazione Agricola', description: '', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', amount: 10 },
  { fileId: '8784431555', customerName: 'SAMARJIT ARORA', service: 'ESTRATTO CONTRIBUTIVO - ECOCERT', description: '', shop: 'BARAKA MULTISERVIZI DI KHALID SHERAZ', amount: 15 },
];

export const uploadTypes = [
  'Pagamento',
  'Documento d\'identità',
  'CU Certificazione Unica (Ex. CUD)',
  'Documento Familiare Carico',
  'Altro',
  'Permesso di soggiorno',
  'Delega/Procura',
  'Domanda',
  'Ricevuta',
  'GEOMETRA',
];

export const services = [
  'Disoccupazione Agricola',
  'ESTRATTO CONTRIBUTIVO - ECOCERT',
  'DISOCCUPAZIONE',
  'PERMESSO DI SOGGIORNO',
  'Delega/Procura',
  'Domanda',
  'Ricevuta',
];

export const fileComments = [
  {
    id: 1,
    date: '2026-03-21 14:08:15',
    user: 'SHERAZ KHALID',
    status: 'Pending',
    text: 'LUI E CONIUGATO MANDO ANCHE LA DOMANDA DELL\'ANNO SCORSO PER COMPILARE DATI DELLA MOGLIE E ANCHE IBAN',
  },
];

export const fileAttachments = [
  { id: 1, name: 'CUD_POS_P...', uploadedOn: '2026-03-21 14:08:15', uploadedBy: 'SHERAZ KHALID', status: 'Pending' },
  { id: 2, name: 'BUSTE_PAGA.pdf', uploadedOn: '2026-03-21 14:08:43', uploadedBy: 'SHERAZ KHALID', status: 'Pending' },
  { id: 3, name: 'ID_Front.pdf', uploadedOn: '2026-03-11 19:13:07', uploadedBy: 'SHERAZ KHALID', status: 'Pending' },
];
