import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TEAMS = [
  // Brasil
  { id: 'flamengo', name: 'Flamengo', shortName: 'FLA', country: 'Brasil', league: 'Brasileirão Série A', continent: 'brasil', primaryColor: '#CC0000', secondaryColor: '#000000', accentColor: '#CC0000' },
  { id: 'corinthians', name: 'Corinthians', shortName: 'COR', country: 'Brasil', league: 'Brasileirão Série A', continent: 'brasil', primaryColor: '#FFFFFF', secondaryColor: '#000000', accentColor: '#000000' },
  { id: 'palmeiras', name: 'Palmeiras', shortName: 'PAL', country: 'Brasil', league: 'Brasileirão Série A', continent: 'brasil', primaryColor: '#006437', secondaryColor: '#FFFFFF', accentColor: '#006437' },
  { id: 'santos', name: 'Santos', shortName: 'SAN', country: 'Brasil', league: 'Brasileirão Série A', continent: 'brasil', primaryColor: '#FFFFFF', secondaryColor: '#000000', accentColor: '#FFFFFF' },
  { id: 'sao-paulo', name: 'São Paulo', shortName: 'SPF', country: 'Brasil', league: 'Brasileirão Série A', continent: 'brasil', primaryColor: '#FFFFFF', secondaryColor: '#FF0000', accentColor: '#000000' },
  { id: 'atletico-mg', name: 'Atlético Mineiro', shortName: 'CAM', country: 'Brasil', league: 'Brasileirão Série A', continent: 'brasil', primaryColor: '#000000', secondaryColor: '#FFFFFF', accentColor: '#000000' },
  { id: 'gremio', name: 'Grêmio', shortName: 'GRE', country: 'Brasil', league: 'Brasileirão Série A', continent: 'brasil', primaryColor: '#1B3FA0', secondaryColor: '#000000', accentColor: '#B3B3B3' },
  { id: 'internacional', name: 'Internacional', shortName: 'INT', country: 'Brasil', league: 'Brasileirão Série A', continent: 'brasil', primaryColor: '#CC0000', secondaryColor: '#FFFFFF', accentColor: '#CC0000' },
  // Europa
  { id: 'barcelona', name: 'FC Barcelona', shortName: 'BAR', country: 'Espanha', league: 'La Liga', continent: 'europa', primaryColor: '#A50044', secondaryColor: '#004D98', accentColor: '#EDBB00' },
  { id: 'real-madrid', name: 'Real Madrid', shortName: 'RMA', country: 'Espanha', league: 'La Liga', continent: 'europa', primaryColor: '#FFFFFF', secondaryColor: '#002B5C', accentColor: '#C0A96C' },
  { id: 'manchester-city', name: 'Manchester City', shortName: 'MCI', country: 'Inglaterra', league: 'Premier League', continent: 'europa', primaryColor: '#6CABDD', secondaryColor: '#1C2C5B', accentColor: '#6CABDD' },
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', country: 'França', league: 'Ligue 1', continent: 'europa', primaryColor: '#003370', secondaryColor: '#CC0033', accentColor: '#FFFFFF' },
  { id: 'juventus', name: 'Juventus', shortName: 'JUV', country: 'Itália', league: 'Serie A', continent: 'europa', primaryColor: '#000000', secondaryColor: '#FFFFFF', accentColor: '#000000' },
  { id: 'bayern', name: 'Bayern München', shortName: 'FCB', country: 'Alemanha', league: 'Bundesliga', continent: 'europa', primaryColor: '#DC052D', secondaryColor: '#0066B2', accentColor: '#DC052D' },
  { id: 'liverpool', name: 'Liverpool', shortName: 'LIV', country: 'Inglaterra', league: 'Premier League', continent: 'europa', primaryColor: '#C8102E', secondaryColor: '#00B2A9', accentColor: '#C8102E' },
  // América do Sul
  { id: 'river-plate', name: 'River Plate', shortName: 'RIV', country: 'Argentina', league: 'Liga Profesional', continent: 'america-sul', primaryColor: '#FFFFFF', secondaryColor: '#CC0000', accentColor: '#CC0000' },
  { id: 'boca-juniors', name: 'Boca Juniors', shortName: 'BOC', country: 'Argentina', league: 'Liga Profesional', continent: 'america-sul', primaryColor: '#1A4896', secondaryColor: '#F9C215', accentColor: '#F9C215' },
  // Seleções
  { id: 'brasil', name: 'Seleção Brasileira', shortName: 'BRA', country: 'Brasil', league: 'FIFA', continent: 'selecoes', primaryColor: '#009C3B', secondaryColor: '#FFDF00', accentColor: '#002776' },
  { id: 'argentina', name: 'Argentina', shortName: 'ARG', country: 'Argentina', league: 'FIFA', continent: 'selecoes', primaryColor: '#75AADB', secondaryColor: '#FFFFFF', accentColor: '#75AADB' },
  { id: 'franca', name: 'França', shortName: 'FRA', country: 'França', league: 'FIFA', continent: 'selecoes', primaryColor: '#002395', secondaryColor: '#FFFFFF', accentColor: '#ED2939' },
  { id: 'alemanha', name: 'Alemanha', shortName: 'GER', country: 'Alemanha', league: 'FIFA', continent: 'selecoes', primaryColor: '#FFFFFF', secondaryColor: '#000000', accentColor: '#DD0000' },
  { id: 'portugal', name: 'Portugal', shortName: 'POR', country: 'Portugal', league: 'FIFA', continent: 'selecoes', primaryColor: '#C8102E', secondaryColor: '#006600', accentColor: '#FFCC00' },
]

const PATCHES = [
  { name: 'FIFA World Cup Winner', position: 'peito-esquerdo', price: 8 },
  { name: 'Champions League', position: 'manga-esquerda', price: 8 },
  { name: 'Capitão FIFA', position: 'manga-direita', price: 8 },
  { name: 'Escudo da Copa', position: 'peito-direito', price: 8 },
  { name: 'Patch Liga', position: 'manga-esquerda', price: 8 },
  { name: 'Centenário', position: 'peito-esquerdo', price: 8 },
  { name: 'Recordista', position: 'peito-esquerdo', price: 8 },
  { name: 'Hall da Fama', position: 'manga-esquerda', price: 8 },
]

const CHAMPIONSHIPS = [
  { name: 'Copa do Mundo FIFA', price: 12 },
  { name: 'UEFA Champions League', price: 12 },
  { name: 'Copa Libertadores', price: 12 },
  { name: 'Copa do Brasil', price: 12 },
  { name: 'Brasileirão', price: 12 },
  { name: 'La Liga', price: 12 },
  { name: 'Premier League', price: 12 },
]

async function main() {
  console.log('🌱 Iniciando seed...')

  await prisma.team.createMany({
    data: TEAMS.map((t) => ({ ...t, founded: null, active: true })),
    skipDuplicates: true,
  })
  console.log(`✅ ${TEAMS.length} times inseridos`)

  for (const team of TEAMS) {
    await prisma.kitModel.createMany({
      data: [
        { teamId: team.id, season: '2025/26', type: 'HOME', name: 'Camisa I', basePrice: 189.9, active: true, sortOrder: 1 },
        { teamId: team.id, season: '2025/26', type: 'AWAY', name: 'Camisa II', basePrice: 189.9, active: true, sortOrder: 2 },
      ],
      skipDuplicates: true,
    })
  }
  console.log(`✅ Kit models inseridos`)

  await prisma.patch.createMany({
    data: PATCHES.map((p) => ({ ...p, active: true })),
    skipDuplicates: true,
  })
  console.log(`✅ ${PATCHES.length} patches inseridos`)

  await prisma.championship.createMany({
    data: CHAMPIONSHIPS.map((c) => ({ ...c, active: true })),
    skipDuplicates: true,
  })
  console.log(`✅ ${CHAMPIONSHIPS.length} campeonatos inseridos`)

  console.log('🎉 Seed concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
