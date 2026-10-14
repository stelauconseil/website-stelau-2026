import { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {ChevronRight,FileKey2,Layers,X,Tabs,TabsContent,TabsList,TabsTrigger,Switch} from './primitives';
import {useLocale,fieldValue} from './locale';
import type { decode, Node } from '@/lib/asn1/decode';
import { fieldAtNode, hexBytes, rfc, type CertificateField } from '@/lib/asn1/x509';

type Data = ReturnType<typeof decode>;
const palette = ['#6589e8', '#9675d9', '#33a99b', '#d2a14c', '#d77798', '#6c9dce'];
const title = (n: Node) => n.label || n.type.replaceAll('_', ' ');
const offset = (n: number) => `0x${n.toString(16).toUpperCase().padStart(4, '0')}`;

/** Own the virtualizer alongside its scroll element: both mount on each tab entry. */
function Structure({ data, selected, collapsed, setCollapsed, select }: {
  data: Data; selected: Node; collapsed: Set<number>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<number>>>; select: (n: Node) => void;
}) {
  const {t,lang}=useLocale();
  const scroll = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => {
    const out: Node[] = [];
    function visit(n: Node) { out.push(n); if (!collapsed.has(n.id)) n.children.forEach(visit); }
    visit(data.root); return out;
  }, [data, collapsed]);
  const virtual = useVirtualizer({ count: rows.length, getScrollElement: () => scroll.current, estimateSize: () => 40, getItemKey: i => rows[i].id, overscan: 12 });
  useEffect(() => {
    const index = rows.findIndex(n => n.id === selected.id);
    if (index >= 0) virtual.scrollToIndex(index, { align: 'auto' });
  }, [selected.id, rows, virtual]);
  return <>
    <div className="panelhead tree-toolbar"><h2>{t('Structure ASN.1')}</h2><div className="actions">
      <button onClick={() => setCollapsed(new Set())}>{t('Tout déplier')}</button>
      <button onClick={() => setCollapsed(new Set(data.flat.filter(n => n.children.length).map(n => n.id)))}>{t('Tout replier')}</button>
    </div></div>
    <div className="tree-scroll" ref={scroll} aria-label={t('Arbre ASN.1')}>
      <div style={{ height: virtual.getTotalSize(), position: 'relative' }}>
        {virtual.getVirtualItems().map(v => {
          const n = rows[v.index];
          return <div key={n.id} data-node-id={n.id} className={`node ${selected.id === n.id ? 'selected' : ''}`} style={{ position: 'absolute', top: 0, transform: `translateY(${v.start}px)`, height: 40, width: '100%', paddingLeft: 12 + Math.min(n.depth, 12) * 15, borderLeftColor: palette[n.depth % palette.length] }}>
            <button className="chevron" aria-label={`${t(collapsed.has(n.id) ? 'Déplier' : 'Replier')} ${t(title(n))} ${lang==='fr'?'à':'at'} ${n.id}`} aria-expanded={n.children.length ? !collapsed.has(n.id) : undefined} disabled={!n.children.length} onClick={() => setCollapsed(s => { const copy = new Set(s); copy.has(n.id) ? copy.delete(n.id) : copy.add(n.id); return copy; })}>
              <ChevronRight size={13} style={{ transform: n.children.length && !collapsed.has(n.id) ? 'rotate(90deg)' : undefined, opacity: n.children.length ? 1 : 0 }} />
            </button>
            <button className="nodelabel" aria-pressed={selected.id === n.id} onClick={() => select(n)} title={`${t(title(n))} · ${n.value}`}>
              <span className="type-dot" style={{ background: palette[n.depth % palette.length] }} /><b>{t(title(n))}</b>
              <span className="nodevalue">{n.children.length ? `${n.children.length} ${t('éléments')}` : n.value}</span><small>{n.end - n.id} {lang==='fr'?'o.':'B'}</small>
            </button>
          </div>;
        })}
      </div>
    </div>
    <div className="panel-status">{rows.length} / {data.flat.length} {t('éléments accessibles · couleurs par niveau')}</div>
  </>;
}

function CertificateView({ data, field, select, qc = false }: { data: Data; field?: CertificateField; select: (n: Node) => void; qc?: boolean }) {
  const {t,lang}=useLocale();
  const container = useRef<HTMLDivElement>(null);
  const fields = data.fields.filter(f => qc ? f.schema === 'QCStatement' : f.group !== 'Extensions' && f.group !== '_structure');
  const groups = Array.from(new Set(fields.map(f => f.group)));
  const isSelected = (f: CertificateField) => f.id === field?.id || (!!field && ['_structure', 'Extensions'].includes(field.group) && f.node.id >= field.node.id && f.node.end <= field.node.end);
  const order = ['Général', 'Sujet', 'Émetteur', 'Validité', 'Clé publique'];
  groups.sort((a, b) => (order.includes(a) ? order.indexOf(a) : a === 'Signature' ? 100 : 50) - (order.includes(b) ? order.indexOf(b) : b === 'Signature' ? 100 : 50));
  useEffect(() => {
    const el = container.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (el && container.current) {
      const scroll = container.current;
      const top = el.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
      if (top < scroll.scrollTop || top + el.offsetHeight > scroll.scrollTop + scroll.clientHeight) scroll.scrollTop = Math.max(0, top - 50);
    }
  }, [field?.id]);
  return <>
    <div className="panelhead"><h2>{qc ? 'QCStatements' : t('Certificat X.509')}</h2><span>{fields.length} {t('valeurs')}</span></div>
    <div className="certificate-scroll" ref={container}>
      <p className="reading-note">{t(qc ? 'Déclarations présentes dans le certificat.' : 'Sélectionnez une valeur pour retrouver ses octets.')} {t('La conformité et la confiance ne sont pas vérifiées.')}</p>
      {!data.cert && <p className="reading-note">{t('Cet objet n’est pas reconnu comme un certificat X.509.')}</p>}
      {qc && fields.length === 0 && <p className="reading-note">{t('Aucun QCStatement présent.')}</p>}
      {groups.map(group => <section className="fieldgroup" key={group}><h3>{t(group)}</h3>
        {fields.filter(f => f.group === group).map(f => <button data-field-id={f.id} key={f.id} className={`certificate-field ${isSelected(f) ? 'selected' : ''}`} aria-pressed={isSelected(f)} onClick={() => select(f.node)}>
          <span className="field-label">{t(f.label)}{f.critical && <span className="critical">{t('Critique')}</span>}</span>
          <span className="field-value">{fieldValue(f.value,f.schema,lang)}</span>
          <span className="field-source">{f.schema} · {offset(f.node.id)} · {f.node.end - f.node.id} {lang==='fr'?'o.':'B'}</span>
        </button>)}
      </section>)}
    </div>
    <div className="panel-status">{t('Valeurs reliées à leur encodage · aucune requête OCSP ou CRL')}</div>
  </>;
}

function HexView({ data, selected, field, selectByte }: { data: Data; selected: Node; field?: CertificateField; selectByte: (i: number) => void }) {
  const {t,lang}=useLocale();
  const scroll = useRef<HTMLDivElement>(null);
  const [annotations, setAnnotations] = useState(true);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const virtual = useVirtualizer({ count: Math.ceil(data.bytes.length / 16), getScrollElement: () => scroll.current, estimateSize: () => 32, overscan: 10 });
  const color = palette[selected.depth % palette.length];
  useEffect(() => { virtual.scrollToIndex(Math.floor(selected.id / 16), { align: 'start' }); }, [selected.id, data, virtual]);
  return <section className="hexpanel">
    <div className="panelhead"><h2>{t('Vue hexadécimale')}</h2><label className="annotation-toggle" htmlFor="annotations"><Switch id="annotations" checked={annotations} onCheckedChange={setAnnotations} />{t('Valeur en surimpression')}</label></div>
    <div className="hexlegend"><span style={{ color }}>■ Tag</span><span>▧ {t('Longueur')}</span><span>□ {t('Contenu')}</span>{selected.indefinite && <span>{lang==='fr'?'EOC : fin BER':'EOC: BER end'}</span>}<code style={{ transform: `translateX(${-horizontalOffset}px)` }}>{Array.from({ length: 16 }, (_, i) => <span key={i}>{i.toString(16).padStart(2, '0').toUpperCase()}</span>)}</code></div>
    <div className="hex-viewport">
      <div ref={scroll} onScroll={e => setHorizontalOffset(e.currentTarget.scrollLeft)} className="hex-scroll" aria-label={t('Octets du certificat')}><div style={{ height: virtual.getTotalSize(), position: 'relative', minWidth: 470 }}>
        {virtual.getVirtualItems().map(v => <div key={v.index} className="hexrow" style={{ position: 'absolute', top: 0, transform: `translateY(${v.start}px)`, height: 32 }}>
          <span className="offset">{(v.index * 16).toString(16).padStart(4, '0').toUpperCase()}</span>
          {Array.from(data.bytes.slice(v.index * 16, v.index * 16 + 16)).map((byte, j) => {
            const i = v.index * 16 + j, on = i >= selected.id && i < selected.end;
            const tag = i < selected.id + selected.tagLength;
            const part = tag ? 'tag' : i < selected.id + selected.header ? 'longueur' : i >= selected.contentEnd ? 'fin BER' : 'contenu';
            return <button key={i} data-byte={i} aria-label={`${t('Octet')} ${i} : ${byte.toString(16).padStart(2, '0')}`} title={`${offset(i)} · ${t(on ? part : 'sélectionner le champ')}`} onClick={() => selectByte(i)} className={on ? 'byte on' : 'byte'} style={on ? { background: tag ? color : `${color}${i < selected.id + selected.header ? '50' : '22'}`, color: tag ? 'white' : undefined } : undefined}>{byte.toString(16).padStart(2, '0').toUpperCase()}</button>;
          })}
        </div>)}
      </div></div>
      {annotations && <aside className="hex-annotation" aria-label={t('Valeur décodée en surimpression')} style={{ borderLeftColor: color }}>
        <button className="annotation-close" aria-label={t('Masquer la surimpression')} onClick={() => setAnnotations(false)}><X size={14} /></button>
        <span className="eyebrow">{t(field ? 'LECTURE X.509' : 'LECTURE ASN.1')}</span>
        <strong>{field?t(field.label):t(title(selected))}</strong><p>{field?fieldValue(field.value,field.schema,lang):(selected.value||t('Structure composée'))}</p>
        <code>{field?.schema ?? selected.type}</code><small>{field && field.node.id !== selected.id ? `${t('Contexte à')} ${offset(field.node.id)} · ` : ''}{t('Sélection')} {offset(selected.id)}–{offset(selected.end - 1)}</small>
      </aside>}
    </div>
    <div className="panel-status">{selected.end - selected.id} {t('octets sélectionnés · cliquez un octet pour retrouver son champ')}</div>
  </section>;
}

function Detail({ data, selected, field }: { data: Data; selected: Node; field?: CertificateField }) {
  const {t,lang}=useLocale();
  const structural = data.cert ? selected.id === data.root.id ? { schema: 'Certificate', references: [rfc(5280, '4.1')] } : selected.id === data.root.children[0].id ? { schema: 'TBSCertificate', references: [rfc(5280, '4.1.2')] } : undefined : undefined;
  const references = field?.references ?? structural?.references ?? [];
  const parts = [
    { label: 'Tag', start: selected.id, end: selected.id + selected.tagLength },
    { label: 'Longueur', start: selected.id + selected.tagLength, end: selected.id + selected.header },
    { label: 'Contenu', start: selected.id + selected.header, end: selected.contentEnd },
    ...(selected.indefinite ? [{ label: 'Fin BER (EOC)', start: selected.contentEnd, end: selected.end }] : []),
  ];
  return <section className="detail selection-detail" aria-label={t('Détail de la sélection')} style={{ borderTopColor: palette[selected.depth % palette.length] }}>
    <div><p className="eyebrow">{t('CHAMP SÉLECTIONNÉ · NIVEAU')} {selected.depth}</p><h2>{field?t(field.label):t(title(selected))}</h2><code>ASN.1 : {selected.type}</code><p className="schema-label">{t(field && field.node.id !== selected.id ? 'Contexte X.509' : 'Type X.509')}</p><code className="schema">{field?.schema ?? structural?.schema ?? t('Non identifié pour ce nœud')}</code><div className="references">{references.map(r => <a key={r.url} href={r.url} target="_blank" rel="noreferrer">{r.label}</a>)}</div></div>
    <div className="detailvalue"><p>{field?fieldValue(field.value,field.schema,lang):(selected.value||t('Structure composée'))}</p><div className="metrics"><span>{t('Début')} <b>{offset(selected.id)} ({selected.id})</b></span><span>{t('Fin exclusive')} <b>{offset(selected.end)} ({selected.end})</b></span><span>Total <b>{selected.end - selected.id} {lang==='fr'?'o.':'B'}</b></span></div>
      <div className="byte-breakdown">{parts.map(part => <div key={part.label}><span>{t(part.label)}<small>{part.end - part.start} {lang==='fr'?'o.':'B'} · [{part.start}, {part.end}[</small></span><code>{part.end === part.start ? t('Vide') : hexBytes(data.bytes.slice(part.start, Math.min(part.end, part.start + 96)))}{part.end - part.start > 96 ? ` … (${part.end - part.start - 96} ${t('octets supplémentaires')})` : ''}</code></div>)}</div>
    </div>
  </section>;
}

export default function Inspector({ data }: { data: Data }) {
  const {t}=useLocale();
  const [selected, setSelected] = useState(data.root);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [tab, setTab] = useState('explore');
  const field = useMemo(() => fieldAtNode(data.fields, selected), [data, selected]);
  const byId = useMemo(() => new Map(data.flat.map(n => [n.id, n])), [data]);
  function select(n: Node) {
    setSelected(n);
    setCollapsed(previous => { const next = new Set(previous); let parent = n.parent; while (parent !== undefined) { next.delete(parent); parent = byId.get(parent)?.parent; } return next; });
  }
  function selectByte(i: number) {
    let node = data.root;
    for (const candidate of data.flat) if (candidate.id <= i && candidate.end > i && candidate.depth > node.depth) node = candidate;
    select(node);
  }
  return <Tabs value={tab} onValueChange={setTab} className="inspector">
    <div className="tabbar"><TabsList variant="line" aria-label={t('Vues du certificat')}><TabsTrigger value="explore"><Layers size={16} />{t('Structure & octets')}</TabsTrigger><TabsTrigger value="certificate"><FileKey2 size={16} />{t('Certificat X.509')}</TabsTrigger><TabsTrigger value="qc">QCStatements <span className="count">{data.qc.length}</span></TabsTrigger></TabsList><span>{t('Une sélection commune aux trois vues')}</span></div>
    <div className="explorer"><section className="treepanel">
      <TabsContent value="explore"><Structure data={data} selected={selected} collapsed={collapsed} setCollapsed={setCollapsed} select={select} /></TabsContent>
      <TabsContent value="certificate"><CertificateView data={data} field={field} select={select} /></TabsContent>
      <TabsContent value="qc"><CertificateView data={data} field={field} select={select} qc /></TabsContent>
    </section><HexView data={data} selected={selected} field={field} selectByte={selectByte} /></div>
    <Detail data={data} selected={selected} field={field} />
  </Tabs>;
}
