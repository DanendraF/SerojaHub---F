import type { Plant } from './types';

export const mockPlants: Plant[] = [
  {
    id: 'tomat-ceri-01',
    name: 'Tomat Ceri',
    type: 'Sayur Buah',
    planting_date: '2026-07-01',
    estimated_harvest_date: '2026-08-28',
    photo_url:
      'https://images.pexels.com/photos/36317349/pexels-photo-36317349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Tomat ceri ditanam di bedeng utama kebun. Tumbuh subur dengan sistem penyiram otomatis Kebun Seroja.',
    benefits:
      'Kaya antioksidan dan vitamin C. Baik untuk daya tahan tubuh dan kesehatan kulit.',
    created_at: '2026-07-01T08:00:00Z',
  },
  {
    id: 'cabai-rawit-02',
    name: 'Cabai Rawit',
    type: 'Cabai',
    planting_date: '2026-06-15',
    estimated_harvest_date: '2026-08-26',
    photo_url:
      'https://images.pexels.com/photos/36133755/pexels-photo-36133755.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Cabai rawit ditanam di pot-pot besar dekat pos pengawasan. Sudah mulai berbuah.',
    benefits:
      'Mengandung capsaicin yang membantu melancarkan peredaran darah dan meningkatkan nafsu makan.',
    created_at: '2026-06-15T08:00:00Z',
  },
  {
    id: 'bayam-hijau-03',
    name: 'Bayam Hijau',
    type: 'Sayur Daun',
    planting_date: '2026-08-01',
    estimated_harvest_date: '2026-08-30',
    photo_url:
      'https://images.pexels.com/photos/35252799/pexels-photo-35252799.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Bayam hijau ditanam di bedeng timur. Tumbuh cepat dan siap panen dalam minggu ini.',
    benefits:
      'Sumber zat besi dan vitamin A yang baik. Membantu menjaga kesehatan mata dan darah.',
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'terung-ungu-04',
    name: 'Terong Ungu',
    type: 'Sayur Buah',
    planting_date: '2026-05-20',
    estimated_harvest_date: '2026-09-15',
    photo_url:
      'https://images.pexels.com/photos/16732700/pexels-photo-16732700.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Terong ungu ditanam di area selatan kebun. Tanaman tumbuh tinggi dengan buah yang lebat.',
    benefits:
      'Mengandung serat tinggi dan antioksidan. Baik untuk pencernaan dan kesehatan jantung.',
    created_at: '2026-05-20T08:00:00Z',
  },
  {
    id: 'kale-05',
    name: 'Kale',
    type: 'Sayur Daun',
    planting_date: '2026-07-10',
    estimated_harvest_date: '2026-09-20',
    photo_url:
      'https://images.pexels.com/photos/5758072/pexels-photo-5758072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Kale adalah sayur super yang baru diperkenalkan di Kebun Seroja. Tumbuh baik di iklim kami.',
    benefits:
      'Salah satu sayur paling bergizi di dunia. Kaya vitamin K, C, dan antioksidan.',
    created_at: '2026-07-10T08:00:00Z',
  },
];
