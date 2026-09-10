'use client';
import { useId, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { assetUrl } from '@/lib/client';
import type { Spot } from '@/lib/quote';

const threadColors = [
  { number: '1005', name: 'ピンク', color: '#b52f67' },
  { number: '1359', name: 'ショッキングピンク', color: '#9b174f' },
  { number: '9022', name: 'レッド', color: '#b73527' },
  { number: '9324', name: 'ダークレッド', color: '#8f2525' },
  { number: '1113', name: 'オレンジ', color: '#b95d2c' },
  { number: '1098', name: 'マスタードゴールド', color: '#b88a3c' },
  { number: '1094', name: '黄色', color: '#f2df00' },
  { number: '2218', name: 'ブラック', color: '#34383a' },
  { number: '9026', name: 'エンジ色', color: '#493235' },
  { number: '1168', name: 'くすみピンク', color: '#a97878' },
  { number: '1189', name: '濃紺', color: '#172036' },
  { number: '1039', name: 'ネイビー', color: '#101b4b' },
  { number: '1038', name: 'インディゴブルー', color: '#142758' },
  { number: '1036', name: 'ブルー', color: '#174b9a' },
  { number: '1245', name: '水色', color: '#45a5cf' },
  { number: '1033', name: 'ペールブルー', color: '#759ab5' },
  { number: '1079', name: 'ダークグリーン', color: '#102e2a' },
  { number: '1061', name: 'グリーン', color: '#096340' },
  { number: '1058', name: 'オリーブグリーン', color: '#31803d' },
  { number: '1442', name: 'ブルーグレー', color: '#40576b' },
  { number: '1610', name: '濃いグレー', color: '#34313c' },
  { number: '1141', name: 'シルバーグレー', color: '#9a9c9d' },
  { number: '1128', name: 'ムラサキ', color: '#4c247c' },
  { number: '2614', name: '藤色', color: '#76647e' },
  { number: '1817', name: '青紫', color: '#292360' },
  { number: '1197', name: '黒', color: '#111216' },
  { number: '1198', name: '白', color: '#f4f3ed' },
  { number: '113', name: 'ゴールド', color: '#c6a122' },
  { number: '101', name: 'シルバー', color: '#a5a5a3' },
] as const;

export function ThreadColorPicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = threadColors.find(
    (item) =>
      value === item.number ||
      value === `${item.name}（糸番号 ${item.number}）`,
  );
  return (
    <div className="field" id={id}>
      <span>
        色名・指定番号<em>必須</em>
      </span>
      <button
        className="thread-picker-trigger"
        type="button"
        onClick={() => setOpen(true)}
      >
        <i style={{ background: selected?.color || '#fff' }} />
        <span>
          <strong>{selected?.name || value || '糸色を選択'}</strong>
          <small>
            {selected
              ? `糸番号 ${selected.number}`
              : '色見本の一覧から選んでください'}
          </small>
        </span>
        <b>色見本から選ぶ</b>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="thread-picker-dialog">
          <DialogHeader>
            <DialogTitle>希望糸色を選ぶ</DialogTitle>
            <DialogDescription>
              色見本・色名・糸番号を確認して選択してください。
            </DialogDescription>
          </DialogHeader>
          <div className="thread-color-list">
            {threadColors.map((item) => {
              const isSelected = item.number === selected?.number;
              return (
                <button
                  type="button"
                  className={`thread-color-choice ${isSelected ? 'selected' : ''}`}
                  key={item.number}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(`${item.name}（糸番号 ${item.number}）`);
                    setOpen(false);
                  }}
                >
                  <i style={{ background: item.color }} />
                  <span>
                    <strong>{item.name}</strong>
                    <small>糸番号 {item.number}</small>
                  </span>
                  {isSelected && <CheckCircle2 aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function Field({
  label,
  value,
  onChange,
  id,
  required = false,
  type = 'text',
  placeholder = '',
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  const generated = useId();
  const key = id || generated;
  return (
    <label className="field" htmlFor={key}>
      {label}
      {required && <em>必須</em>}
      <input
        id={key}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        min={min}
        step={step}
        maxLength={type === 'number' ? undefined : 500}
        aria-required={required}
      />
    </label>
  );
}
export function Choice({
  label,
  value,
  onChange,
  options,
  id,
  disabled = [],
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  id?: string;
  disabled?: string[];
}) {
  const key = useId();
  return (
    <div className="field">
      <label id={`${id || key}-label`} htmlFor={id || key}>
        {label}
      </label>
      <Select value={value} onValueChange={(v) => onChange(v || '')}>
        <SelectTrigger id={id || key} aria-labelledby={`${id || key}-label`}>
          <SelectValue>{value || '選択してください'}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((v) => (
            <SelectItem key={v} value={v} disabled={disabled.includes(v)}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export function Check({
  label,
  checked,
  onChange,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}) {
  const key = useId();
  return (
    <label className="checkrow" htmlFor={id || key}>
      <Checkbox
        id={id || key}
        checked={checked}
        onCheckedChange={(v) => onChange(!!v)}
      />
      <span>{label}</span>
    </label>
  );
}
export function Notes({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  const key = useId();
  return (
    <label className="field" htmlFor={id || key}>
      {label}
      <textarea
        id={id || key}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={5000}
      />
    </label>
  );
}
export function LogoPreview({ spot }: { spot: Spot }) {
  if (!spot.asset) return null;
  return (
    <>
      <div className="dimension-preview">
        <img
          src={assetUrl(spot.asset)}
          alt={`ロゴ原稿：${spot.asset.name}`}
          style={{
            width: '240px',
            aspectRatio:
              Number(spot.width) > 0 && Number(spot.height) > 0
                ? `${spot.width} / ${spot.height}`
                : undefined,
            objectFit: 'fill',
          }}
        />
        <div className="width">横 {spot.width || '未指定'} mm</div>
        <div className="height">縦 {spot.height || '未指定'} mm</div>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>
        配置・寸法の参考図です。実際の糸色や縫い目を再現するものではありません。
      </p>
    </>
  );
}
