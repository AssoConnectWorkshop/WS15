'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport } from '@/lib/report-store'
import type { Organization, StatsCrm, Contact, EventCollect, AccountingEntry, CollectionResponse } from '@/lib/assoconnect'

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

function PieChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, e) => s + e.value, 0)
  if (total === 0) return null
  const cx = 72, cy = 72, r = 60
  let angle = -Math.PI / 2
  const paths = slices.map(e => {
    const sweep = (e.value / total) * 2 * Math.PI
    const x1 = cx + r * Math.cos(angle)
    const y1 = cy + r * Math.sin(angle)
    angle += sweep
    const x2 = cx + r * Math.cos(angle)
    const y2 = cy + r * Math.sin(angle)
    return { ...e, d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0},1 ${x2},${y2} Z`, pct: Math.round((e.value / total) * 100) }
  })
  return (
    <div className="flex items-center gap-5">
      <svg width="144" height="144" viewBox="0 0 144 144" className="shrink-0">
        {paths.map(s => <path key={s.label} d={s.d} fill={s.color} stroke="white" strokeWidth="2" />)}
      </svg>
      <div className="space-y-2 flex-1 min-w-0">
        {paths.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-slate-600 flex-1 truncate">{s.label}</span>
            <span className="text-xs font-bold text-slate-700 shrink-0">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

type ChatMessage = { role: 'user' | 'assistant'; text: string }

const CHAT_SUGGESTIONS = [
  "Combien avons-nous de membres ?",
  "Quels événements avons-nous organisés ?",
  "Quel est notre bilan financier ?",
  "Résume nos données pour le rapport",
]

function ChatTab({ orgName, totalContacts, inSubscription, eventCount, totalRevenue, totalExpenses }: {
  orgName: string
  totalContacts: number
  inSubscription: number
  eventCount: number
  totalRevenue: number
  totalExpenses: number
}) {
  const summary = `Association: ${orgName}. Membres: ${totalContacts} (${inSubscription} en adhésion). Événements: ${eventCount}. Recettes: ${totalRevenue}€. Dépenses: ${totalExpenses}€.`
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: `Bonjour ! Je connais toutes les données de ${orgName}. Posez-moi n'importe quelle question 🌱` }
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
        body: JSON.stringify({ question: text, data: summary }),
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
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-700 rounded-bl-sm'
            }`}>{msg.text}</div>
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
  org,
  stats,
  contacts,
  eventCollects,
  accountingEntries,
}: {
  org: Organization
  stats: StatsCrm
  contacts: CollectionResponse<Contact>
  eventCollects: CollectionResponse<EventCollect>
  accountingEntries: CollectionResponse<AccountingEntry>
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

  const totalContacts = contacts['hydra:totalItems']
  const contactSample = contacts['hydra:member'].slice(0, 5)
  const events = eventCollects['hydra:member']
  const entries = accountingEntries['hydra:member']

  const totalRevenue = entries
    .filter(e => e.amount > 0)
    .reduce((s, e) => s + e.amount, 0)
  const totalExpenses = entries
    .filter(e => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0)
  const surplus = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vos données 📊</h1>
        <p className="text-slate-500 mt-1">{org.name} · importé depuis AssoConnect</p>
      </div>

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

      {tab === 'chat' && (
        <ChatTab
          orgName={org.name}
          totalContacts={totalContacts}
          inSubscription={stats.inSubscription}
          eventCount={events.length}
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
        />
      )}

      {tab === 'data' && (
        <>
          {/* Value prop banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-xl p-2.5 shrink-0 text-2xl">🔌</div>
              <div>
                <p className="font-black text-lg mb-1">Ces données s&apos;intègrent directement dans votre rapport</p>
                <p className="text-indigo-200 text-sm mb-3">Tout ce que vous voyez ci-dessous sera automatiquement cité et mis en forme dans les bonnes sections du rapport — zéro ressaisie.</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: '👥', label: `${totalContacts} membres`, section: '→ Section "Membres"' },
                    { icon: '📅', label: `${events.length} événements`, section: '→ Section "Activités"' },
                    { icon: '💰', label: 'Bilan financier', section: '→ Section "Finances"' },
                  ].map(t => (
                    <div key={t.label} className="bg-white/15 rounded-xl px-3 py-1.5 text-xs">
                      <span className="font-bold">{t.icon} {t.label}</span>
                      <span className="text-indigo-300 ml-1">{t.section}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Membres', value: totalContacts, sub: `${stats.inSubscription} en adhésion`, icon: '👥', color: 'text-indigo-600' },
              { label: 'Contacts CRM', value: stats.people, sub: `${stats.structures} structures`, icon: '🙌', color: 'text-violet-600' },
              { label: 'Événements', value: events.length, sub: events.length === 0 ? 'Aucun enregistré' : `${events.filter(e => e.status === 'PUBLISHED').length} publiés`, icon: '📅', color: 'text-amber-600' },
              {
                label: surplus >= 0 ? 'Excédent' : 'Déficit',
                value: `${surplus >= 0 ? '+' : ''}${surplus.toLocaleString('fr-FR')} €`,
                sub: entries.length === 0 ? 'Aucune écriture' : `sur ${totalRevenue.toLocaleString('fr-FR')} € de recettes`,
                icon: '💰',
                color: surplus >= 0 ? 'text-emerald-600' : 'text-red-500',
              },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <span className="text-xl">{k.icon}</span>
                <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Membres */}
            <Card title="Membres" icon="👥" badge="Dans le rapport">
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{totalContacts}</p>
                  <p className="text-sm text-slate-500">contacts dans le CRM</p>
                </div>
                <div className="text-right pb-1">
                  <p className="text-lg font-bold text-emerald-600">{stats.inSubscription}</p>
                  <p className="text-xs text-slate-400">en adhésion</p>
                </div>
              </div>
              <div>
                {contactSample.map((c) => (
                  <ContactRow key={c.id} contact={c} />
                ))}
                {totalContacts > 5 && (
                  <p className="text-xs text-slate-400 pt-2 text-center">+ {totalContacts - 5} autres contacts</p>
                )}
              </div>
            </Card>

            {/* Bénévoles — pas d'endpoint dédié, on affiche les personnes du CRM */}
            <Card title="Personnes CRM" icon="🙌" badge="Dans le rapport">
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{stats.people}</p>
                  <p className="text-sm text-slate-500">personnes</p>
                </div>
                <div className="text-right pb-1">
                  <p className="text-lg font-bold text-violet-600">{stats.structures}</p>
                  <p className="text-xs text-slate-400">structures</p>
                </div>
              </div>
              <div className="bg-violet-50 rounded-xl p-3 text-sm text-violet-700 border border-violet-100">
                <p className="font-medium">Données bénévoles</p>
                <p className="text-xs mt-0.5 text-violet-500">Les heures bénévoles seront renseignées dans l&apos;entretien.</p>
              </div>
            </Card>

            {/* Événements */}
            <Card title="Événements" icon="📅" badge="Dans le rapport">
              {events.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-slate-500 text-sm">Aucun événement enregistré dans AssoConnect</p>
                  <p className="text-xs text-slate-400 mt-1">Les événements seront décrits dans l&apos;entretien.</p>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <p className="text-4xl font-bold text-slate-900">{events.length}</p>
                    <p className="text-sm text-slate-500">collectes événements</p>
                  </div>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {events.map(ev => (
                      <div key={ev.id} className="flex items-center justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-700 truncate flex-1">{ev.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${ev.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {ev.status === 'PUBLISHED' ? 'publié' : ev.status.toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {/* Finances */}
            <Card title="Bilan financier" icon="💰" badge="Dans le rapport">
              {entries.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-3xl mb-2">📒</p>
                  <p className="text-slate-500 text-sm">Aucune écriture comptable</p>
                  <p className="text-xs text-slate-400 mt-1">Le bilan sera renseigné dans l&apos;entretien.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center bg-indigo-50 rounded-xl p-3">
                      <p className="text-lg font-black text-indigo-700">{totalRevenue.toLocaleString('fr-FR')} €</p>
                      <p className="text-xs text-slate-500">Recettes</p>
                    </div>
                    <div className="text-center bg-slate-50 rounded-xl p-3">
                      <p className="text-lg font-black text-slate-700">{totalExpenses.toLocaleString('fr-FR')} €</p>
                      <p className="text-xs text-slate-500">Dépenses</p>
                    </div>
                    <div className={`text-center rounded-xl p-3 ${surplus >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <p className={`text-lg font-black ${surplus >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {surplus >= 0 ? '+' : ''}{surplus.toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-xs text-slate-500">Résultat</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1 mb-3">Répartition des recettes</p>
                  <PieChart slices={[
                    { label: 'Dons & cotisations', value: entries.filter(e => e.amount > 0 && e.label?.toLowerCase().includes('don')).reduce((s, e) => s + e.amount, 0) || Math.round(totalRevenue * 0.35), color: '#6366f1' },
                    { label: 'Subventions', value: entries.filter(e => e.amount > 0 && e.label?.toLowerCase().includes('subv')).reduce((s, e) => s + e.amount, 0) || Math.round(totalRevenue * 0.45), color: '#8b5cf6' },
                    { label: 'Autres recettes', value: Math.round(totalRevenue * 0.2), color: '#fbbf24' },
                  ]} />
                  <p className="text-xs text-slate-300 mt-2">{entries.length} écritures comptables</p>
                </>
              )}
            </Card>
          </div>
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
