'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport } from '@/lib/report-store'
import type { StatsCrm, Contact, CollectionResponse } from '@/lib/assoconnect'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'

const CATEGORY_LABELS: Record<string, string> = {
  activité: '🌿 Activité',
  formation: '📚 Formation',
  événement: '🎉 Événement',
  sortie: '🚶 Sortie',
  chantier: '🔨 Chantier',
  gouvernance: '📋 Gouvernance',
}

function Card({ title, icon, children, badge }: { title: string; icon: string; children: React.ReactNode; badge?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        {badge && (
          <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            ✓ {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function ContactRow({ contact }: { contact: Contact }) {
  const name = contact.type === 'PERSON'
    ? [contact.firstName, contact.lastName].filter(Boolean).join(' ') || '—'
    : contact.companyName || '—'
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 text-sm">
      <div className="min-w-0">
        <p className="font-medium text-slate-700 truncate">{name}</p>
        {contact.email && <p className="text-xs text-slate-400 truncate">{contact.email}</p>}
      </div>
      <span className="text-xs text-slate-400 shrink-0 ml-3">
        {contact.type === 'PERSON' ? '👤' : '🏢'}
      </span>
    </div>
  )
}

type ChatMessage = { role: 'user' | 'assistant'; text: string }

const CHAT_SUGGESTIONS = [
  "Quel est notre taux de croissance des membres ?",
  "Combien d'heures bénévoles au total ?",
  "Quelle part des revenus vient des subventions ?",
  "Quel événement a eu le plus de succès ?",
]

function ChatTab() {
  const data = DEMO_ASSOCIATION
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: "Bonjour ! Je connais toutes vos données AssoConnect. Posez-moi n'importe quelle question sur vos membres, événements, finances ou bénévoles 🌱" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || loading) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/rapport/chat-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, data }),
      })
      const json = await res.json() as { answer: string }
      setMessages(m => [...m, { role: 'assistant', text: json.answer }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: "Oops, une erreur est survenue. Réessayez ! 😅" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '520px' }}>
      <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50 flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <span className="font-semibold text-slate-700 text-sm">Assistant données AssoConnect</span>
        <span className="ml-auto text-xs text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full">IA</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-slate-100 text-slate-700 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {CHAT_SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-3 py-1.5 hover:bg-indigo-100 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); send(input) }} className="border-t border-slate-100 p-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Posez une question sur vos données…"
          className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
        <button type="submit" disabled={!input.trim() || loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
          →
        </button>
      </form>
    </div>
  )
}

export default function DonneesClient({
  stats,
  contacts,
}: {
  stats: StatsCrm
  contacts: CollectionResponse<Contact>
}) {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [tab, setTab] = useState<'data' | 'chat'>('data')

  useEffect(() => {
    const report = getReport(id)
    if (!report) router.push('/rapport')
  }, [id, router])

  function handleContinue() {
    updateReport(id, { status: 'interview' })
    router.push(`/rapport/${id}/interview`)
  }

  const data = DEMO_ASSOCIATION
  const totalParticipants = data.events.reduce((s, e) => s + e.participants, 0)
  const totalRevenue = Object.values(data.finance.revenue).reduce((s, v) => s + v, 0)
  const totalExpenses = Object.values(data.finance.expenses).reduce((s, v) => s + v, 0)
  const maxRevItem = Math.max(...Object.values(data.finance.revenue))

  const totalContacts = contacts['hydra:totalItems']
  const sample = contacts['hydra:member'].slice(0, 5)

  const revenueEntries = [
    { label: 'Dons', value: data.finance.revenue.donations, color: 'bg-indigo-500' },
    { label: 'Subventions', value: data.finance.revenue.grants, color: 'bg-violet-500' },
    { label: 'Cotisations', value: data.finance.revenue.membershipFees, color: 'bg-amber-400' },
    { label: 'Autres', value: data.finance.revenue.other, color: 'bg-slate-300' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vos données 📊</h1>
        <p className="text-slate-500 mt-1">On a tout récupéré depuis AssoConnect. Vérifiez, explorez, posez des questions !</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('data')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'data' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          📊 Données importées
        </button>
        <button
          onClick={() => setTab('chat')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'chat' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🤖 Chat IA
        </button>
      </div>

      {tab === 'chat' && <ChatTab />}

      {tab === 'data' && (
        <>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-semibold text-indigo-800">Données importées automatiquement</p>
              <p className="text-indigo-600 text-sm">Membres, événements, finances et bénévoles sont prêts. Basculez sur &quot;Chat IA&quot; pour poser des questions sur vos chiffres.</p>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Membres', value: totalContacts, sub: `${stats.inSubscription ?? stats.people} en adhésion`, icon: '👥', color: 'text-indigo-600' },
              { label: 'Bénévoles', value: data.volunteers.total, sub: `${data.volunteers.active} très actifs`, icon: '🙌', color: 'text-violet-600' },
              { label: 'Événements', value: data.events.length, sub: `${totalParticipants} participants`, icon: '📅', color: 'text-amber-600' },
              { label: 'Excédent', value: `+${data.finance.surplus.toLocaleString('fr-FR')} €`, sub: `sur ${totalRevenue.toLocaleString('fr-FR')} € de recettes`, icon: '💰', color: 'text-emerald-600' },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <span className="text-xl">{k.icon}</span>
                <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Membres — données réelles API */}
            <Card title="Membres" icon="👥" badge="Importé">
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{totalContacts}</p>
                  <p className="text-sm text-slate-500">contacts dans le CRM</p>
                </div>
                <div className="text-right pb-1">
                  <p className="text-lg font-bold text-emerald-600">{stats.inSubscription ?? stats.people}</p>
                  <p className="text-xs text-slate-400">en adhésion</p>
                </div>
              </div>
              <div className="space-y-0">
                {sample.map((c) => (
                  <ContactRow key={c.id} contact={c} />
                ))}
                {totalContacts > 5 && (
                  <p className="text-xs text-slate-400 pt-2 text-center">
                    + {totalContacts - 5} autres contacts
                  </p>
                )}
              </div>
            </Card>

            <Card title="Bénévoles" icon="🙌" badge="Importé">
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{data.volunteers.total}</p>
                  <p className="text-sm text-slate-500">bénévoles au total</p>
                </div>
                <div className="text-right pb-1">
                  <p className="text-lg font-bold text-amber-500">{data.volunteers.active}</p>
                  <p className="text-xs text-slate-400">très actifs</p>
                </div>
              </div>
              <div className="space-y-2">
                {data.topVolunteers.slice(0, 3).map(v => (
                  <div key={v.name} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{v.name}</p>
                      <p className="text-xs text-slate-400">{v.role}</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">{v.hours}h</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Événements" icon="📅" badge="Importé">
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{data.events.length}</p>
                  <p className="text-sm text-slate-500">événements</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-slate-900">{totalParticipants.toLocaleString('fr-FR')}</p>
                  <p className="text-sm text-slate-500">participants</p>
                </div>
              </div>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {data.events.map(ev => (
                  <div key={ev.name} className="flex items-center gap-2 text-sm">
                    <span className="text-xs shrink-0">{CATEGORY_LABELS[ev.category]?.split(' ')[0] ?? '•'}</span>
                    <span className="text-slate-700 truncate flex-1 min-w-0">{ev.name}</span>
                    <div className="w-20 bg-slate-100 rounded-full h-1.5 shrink-0">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${Math.min((ev.participants / totalParticipants) * 100 * 3, 100)}%` }} />
                    </div>
                    <span className="text-slate-400 shrink-0 text-xs w-8 text-right">{ev.participants}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Bilan financier" icon="💰" badge="Importé">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center bg-indigo-50 rounded-xl p-3">
                  <p className="text-lg font-black text-indigo-700">{totalRevenue.toLocaleString('fr-FR')} €</p>
                  <p className="text-xs text-slate-500">Recettes</p>
                </div>
                <div className="text-center bg-slate-50 rounded-xl p-3">
                  <p className="text-lg font-black text-slate-700">{totalExpenses.toLocaleString('fr-FR')} €</p>
                  <p className="text-xs text-slate-500">Dépenses</p>
                </div>
                <div className="text-center bg-emerald-50 rounded-xl p-3">
                  <p className="text-lg font-black text-emerald-600">+{data.finance.surplus.toLocaleString('fr-FR')} €</p>
                  <p className="text-xs text-slate-500">Excédent</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Répartition des recettes</p>
              {revenueEntries.map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-slate-500 w-20 shrink-0">{label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                    <div className={`${color} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${(value / maxRevItem) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-600 w-20 text-right">{value.toLocaleString('fr-FR')} €</span>
                </div>
              ))}
            </Card>
          </div>

          <Card title="Partenaires" icon="🤝" badge="Importé">
            <div className="flex flex-wrap gap-3">
              {data.partners.map(p => (
                <div key={p.name} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                  <span className="font-medium text-slate-700 text-sm">{p.name}</span>
                  <span className="text-xs text-slate-400 bg-white border border-slate-100 rounded-full px-2 py-0.5">{p.type}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <div className="flex justify-end">
        <button onClick={handleContinue} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Aller à l&apos;entretien →
        </button>
      </div>
    </div>
  )
}
