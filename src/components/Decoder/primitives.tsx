import {createContext,useContext,useId,type ReactNode,type CSSProperties} from 'react';
import layers from '@/assets/icons/fontawesome/duotone-solid/layer-group.svg?raw';
import certificate from '@/assets/icons/fontawesome/duotone-solid/file-signature.svg?raw';
import close from '@/assets/icons/fontawesome/duotone-solid/xmark.svg?raw';

function Glyph({svg,size=16}:{svg:string;size?:number}){return <span className="decoder-glyph" aria-hidden="true" style={{width:size,height:size}} dangerouslySetInnerHTML={{__html:svg}}/>;}
export const Layers=({size=16}:{size?:number})=><Glyph svg={layers} size={size}/>;
export const FileKey2=({size=16}:{size?:number})=><Glyph svg={certificate} size={size}/>;
export const X=({size=16}:{size?:number})=><Glyph svg={close} size={size}/>;
export const ChevronRight=({size=13,style}:{size?:number;style?:CSSProperties})=><span aria-hidden="true" style={{display:'inline-block',fontSize:size+5,lineHeight:1,...style}}>›</span>;
const TabContext=createContext({value:'explore',onValueChange:(_value:string)=>{},id:''});
export function Tabs({value,onValueChange,className,children}:{value:string;onValueChange:(v:string)=>void;className?:string;children:ReactNode}){const id=useId();return <TabContext.Provider value={{value,onValueChange,id}}><div className={className}>{children}</div></TabContext.Provider>;}
export function TabsList({children,'aria-label':label}:{children:ReactNode;variant?:string;'aria-label'?:string}){
 const {onValueChange}=useContext(TabContext);
 return <div role="tablist" data-slot="tabs-list" aria-label={label} onKeyDown={event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const tabs=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const index=tabs.indexOf(event.target as HTMLButtonElement);if(index<0)return;event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  tabs[next].focus();onValueChange(tabs[next].dataset.value!);
 }}>{children}</div>;
}
export function TabsTrigger({value,children}:{value:string;children:ReactNode}){const c=useContext(TabContext);return <button type="button" role="tab" id={`${c.id}-${value}`} data-slot="tabs-trigger" data-value={value} aria-controls={`${c.id}-${value}-panel`} aria-selected={c.value===value} tabIndex={c.value===value?0:-1} onClick={()=>c.onValueChange(value)}>{children}</button>;}
export function TabsContent({value,children}:{value:string;children:ReactNode}){const c=useContext(TabContext);return c.value===value?<div role="tabpanel" id={`${c.id}-${value}-panel`} aria-labelledby={`${c.id}-${value}`} data-slot="tabs-content">{children}</div>:null;}
export function Switch({id,checked,onCheckedChange}:{id:string;checked:boolean;onCheckedChange:(v:boolean)=>void}){return <button type="button" id={id} role="switch" aria-checked={checked} data-slot="switch" data-state={checked?'checked':'unchecked'} onClick={()=>onCheckedChange(!checked)}><span data-slot="switch-thumb"/></button>;}
