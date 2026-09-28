'use client';

import {useState} from 'react';
import {airportContact} from '@/lib/airport-contact';

export function KakaoIdButton({lang}: {lang: 'ko' | 'en'}) {
  const ko = lang === 'ko';
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle');

  async function copyId() {
    try {
      await navigator.clipboard.writeText(airportContact.kakaoId);
      setStatus('copied');
    } catch {
      setStatus('manual');
    }
  }

  const label = status === 'copied'
    ? (ko ? '카카오톡 ID 복사됨' : 'KakaoTalk ID copied')
    : status === 'manual'
      ? (ko ? '아래 ID를 직접 복사' : 'Copy the ID shown below')
      : (ko ? '카카오톡 ID 복사' : 'Copy KakaoTalk ID');

  return <button type="button" onClick={copyId}><span aria-live="polite">{label}</span></button>;
}
