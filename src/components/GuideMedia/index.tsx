// 사용법 자료를 원본 비율로 표시하는 공용 이미지·영상 카드입니다.
// 자동 재생 없이 브라우저의 재생·탐색·전체화면 기능을 사용합니다.
import React, {useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

type Props = {type: 'image' | 'video'; src: string; title: string; caption: string};

export default function GuideMedia({type, src, title, caption}: Props) {
  const url = useBaseUrl(src);
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`guide-media guide-media--${type}`}>
      <div className="guide-media__heading">
        <span className="guide-media__kind">{type === 'video' ? '영상 가이드' : '화면 가이드'}</span>
        <strong>{title}</strong>
      </div>
      {type === 'video' ? (
        <video controls playsInline preload="metadata" aria-label={title} onError={() => setFailed(true)}>
          <source src={url} type="video/mp4" />
          영상을 재생할 수 없다면 아래 원본 링크를 사용하세요.
        </video>
      ) : (
        <a className="guide-media__image-link" href={url} target="_blank" rel="noopener noreferrer"
          aria-label={`${title} — 원본 이미지 크게 보기`}>
          <img src={url} alt={title} loading="lazy" onError={() => setFailed(true)} />
        </a>
      )}
      <figcaption>
        <p>{caption}</p>
        {failed && <p role="alert">자료를 불러오지 못했습니다. 원본 링크를 확인해 주세요.</p>}
        <a href={url} target="_blank" rel="noopener noreferrer">
          {type === 'video' ? '원본 영상 열기' : '원본 이미지 크게 보기'} ↗
        </a>
        {type === 'video' && <span className="guide-media__hint">재생 · 탐색 · 전체화면은 영상의 컨트롤을 사용하세요.</span>}
      </figcaption>
    </figure>
  );
}
