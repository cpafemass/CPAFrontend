import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { adminApi, segment } from './api'
import type { Campaign } from './types'
import { AdminLink, Filters, Notice, StatusBadge } from './ui'
import { matches, useAction, useAdminData } from './hooks'

export function CampaignsPage() {
  const read = useCallback(() => adminApi<Campaign[]>('/campanhas'), [])
  const { data, error, loading, reload } = useAdminData(read)
  const { busy, message, run } = useAction(reload)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('active')
  const [creating, setCreating] = useState(false)
  const items = data?.filter(c => matches(c, search, status)) || []
  return <section className="admin-card"><div className="admin-title"><div><p className="admin-eyebrow">AVALIAÇÃO INSTITUCIONAL</p><h1>Campanhas</h1></div><button disabled={busy} onClick={() => setCreating(true)}>Nova campanha</button></div>
    {message && <Notice>{message}</Notice>}{error && <Notice>{error} <button onClick={reload}>Tentar novamente</button></Notice>}
    {creating && <CampaignEditor busy={busy} onCancel={() => setCreating(false)} onSave={async dto => { if (await run(() => adminApi('/campanhas', 'POST', dto))) setCreating(false) }} />}
    <Filters search={search} status={status} onSearch={setSearch} onStatus={setStatus} />
    {loading ? <p role="status">Carregando campanhas…</p> : <div className="admin-table-wrap"><table><thead><tr><th>Campanha</th><th>Código</th><th>Estado</th><th>Situação</th><th>Ações</th></tr></thead><tbody>{items.map(c => <tr key={c.id}><td><AdminLink href={`/admin/campanhas/${segment(c.codigo)}`}>{c.nome}</AdminLink></td><td>{c.codigo}</td><td>{c.estado}</td><td><StatusBadge ativo={c.ativo} /></td><td><AdminLink href={`/admin/campanhas/${segment(c.codigo)}`}>Gerenciar →</AdminLink></td></tr>)}</tbody></table>{!items.length && <p>Nenhuma campanha encontrada.</p>}</div>}
  </section>
}

export function CampaignDetail({ campaign }: { campaign: string }) {
  const base = `/campanhas/${segment(campaign)}`
  const read = useCallback(() => adminApi<Campaign>(`/campanhas/${segment(campaign)}`), [campaign])
  const { data, error, loading, reload } = useAdminData(read)
  const { busy, message, run } = useAction(reload)
  const [editing, setEditing] = useState(false)
  return <section className="admin-card"><AdminLink href="/admin/campanhas">← Campanhas</AdminLink>{error && <Notice>{error} <button onClick={reload}>Tentar novamente</button></Notice>}{message && <Notice>{message}</Notice>}
    {loading ? <p role="status">Carregando campanha…</p> : data && <><div className="admin-title"><div><p className="admin-eyebrow">{data.codigo}</p><h1>{data.nome}</h1></div><StatusBadge ativo={data.ativo} /></div><p>Estado: <strong>{data.estado}</strong></p><p>{data.mensagem || 'Sem mensagem de indisponibilidade personalizada.'}</p>
      <div className="admin-actions"><button className="secondary" disabled={busy} onClick={() => setEditing(true)}>Editar campanha</button>
        <button className="secondary" disabled={busy} onClick={() => void run(() => adminApi(`${base}/status`, 'PATCH', { ativo: !data.ativo }), `${data.ativo ? 'Desativar' : 'Reativar'} a campanha? A disponibilidade de todos os seus formulários será afetada.`)}>{data.ativo ? 'Desativar' : 'Reativar'}</button>
        {(['aprovar', 'abrir', 'encerrar'] as const).map(action => <button key={action} disabled={busy || !data.ativo || (action === 'aprovar' ? data.estado !== 'RASCUNHO' : action === 'abrir' ? data.estado !== 'APROVADA' : data.estado === 'ENCERRADA')} onClick={() => void run(() => adminApi(`${base}/${action}`, 'POST'), `${action === 'aprovar' ? 'Aprovar' : action === 'abrir' ? 'Abrir' : 'Encerrar'} a campanha ${data.nome}?`)}>{action === 'aprovar' ? 'Aprovar' : action === 'abrir' ? 'Abrir pesquisa' : 'Encerrar'}</button>)}
      </div>
      {editing && <CampaignEditor item={data} busy={busy} onCancel={() => setEditing(false)} onSave={async dto => { if (await run(() => adminApi(base, 'PUT', dto))) setEditing(false) }} />}
      <div className="admin-callout"><h2>Formulários e versões</h2><p>Prepare os questionários em rascunho, publique as versões e aprove a campanha antes de abrir a pesquisa. Alterações de conteúdo retornam a campanha ao estado de rascunho.</p><AdminLink href={`/admin${base}/formularios`}>Gerenciar formulários →</AdminLink></div>
    </>}
  </section>
}

function CampaignEditor({ item, busy, onCancel, onSave }: { item?: Campaign; busy: boolean; onCancel: () => void; onSave: (dto: unknown) => Promise<void> }) {
  const [code, setCode] = useState(item?.codigo || '')
  const [name, setName] = useState(item?.nome || '')
  const [message, setMessage] = useState(item?.mensagem || '')
  const submit = (e: FormEvent) => { e.preventDefault(); void onSave({ codigo: code, nome: name, mensagem: message || null }) }
  return <form className="admin-editor" onSubmit={submit}><h2>{item ? 'Editar campanha' : 'Nova campanha'}</h2><div className="admin-grid"><label>Código<input required disabled={!!item} maxLength={50} value={code} onChange={e => setCode(e.target.value)} /></label><label>Nome<input required maxLength={150} value={name} onChange={e => setName(e.target.value)} /></label></div><label>Mensagem de indisponibilidade<textarea maxLength={500} value={message} onChange={e => setMessage(e.target.value)} /></label><div className="admin-actions"><button disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button><button type="button" className="secondary" disabled={busy} onClick={onCancel}>Cancelar</button></div></form>
}
