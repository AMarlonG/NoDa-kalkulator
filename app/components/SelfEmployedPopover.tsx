'use client';

import { SelfEmployedRates } from '@/lib/selfEmployedRates';

interface SelfEmployedPopoverProps {
  id: string;
  rates: SelfEmployedRates | null;
}

export function SelfEmployedPopover({ id, rates }: SelfEmployedPopoverProps) {
  return (
    <div id={id} popover='auto' className='popover'>
      <div className='popover-content'>
        <h3 className='popover-title'>
          Er dette et oppdrag eller en ansettelse?
        </h3>

        <p className='popover-text'>
          Jobb som danser, koreograf eller pedagog er i de fleste tilfeller å
          anse som et arbeidsforhold i følge Arbeidsmiljøloven §1.8.
        </p>

        <p className='popover-text'>
          Dersom arbeidet ikke treffer spesifiseringen i denne paragrafen kan du
          ta jobben som et oppdrag. Vi anbefaler da at du legger på 36,8% for å
          dekke dine kostnader med å drive eget firma og besørge egne sosiale
          kostnader.
        </p>

        {rates && (
          <>
            <h4 className='popover-subtitle'>
              Din timesats som selvstendig næringsdrivende:
            </h4>
            <div className='popover-rate-breakdown'>
              <div className='rate-row'>
                <span>Timesats (grunnlag):</span>
                <span>{rates.baseRate.toLocaleString('no-NO')} NOK</span>
              </div>
              <div className='rate-row'>
                <span>+ 36,8% påslag:</span>
                <span>{rates.markup.toLocaleString('no-NO')} NOK</span>
              </div>
              <div className='rate-row rate-total'>
                <span>Timesats med påslag:</span>
                <span>{rates.totalRate.toLocaleString('no-NO')} NOK</span>
              </div>
            </div>
          </>
        )}

        <h4 className='popover-subtitle'>Påslaget dekker:</h4>
        <ul className='popover-list'>
          <li>15,8% - Arbeidsgiveravgift og tap av rettigheter</li>
          <li>12,0% - Feriepenger</li>
          <li>3,6% - Trygdeavgiftsforhøyelse</li>
          <li>0,4% - Frivillig yrkesskadeforsikring</li>
          <li>5,0% - Administrative kostnader</li>
        </ul>

        <button
          type='button'
          className='btn btn-primary popover-close'
          popoverTarget={id}
          popoverTargetAction='hide'
        >
          Lukk
        </button>
      </div>
    </div>
  );
}
