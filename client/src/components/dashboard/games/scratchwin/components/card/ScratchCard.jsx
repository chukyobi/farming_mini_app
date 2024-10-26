import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ScratchCard } from 'next-scratchcard';


const ScratchCard =  forwardRef(({ card }, ref) => {
    const scratchCardRefs = [
      useRef(null),
      useRef(null),
      useRef(null),
      useRef(null),
    ];
    
      useImperativeHandle(ref, () => ({
        resetScratchCards: () => {
          scratchCardRefs.forEach((ref) => {
            if (ref.current) {
              ref.current.reset();
            }
          });
        },
      }));
    
      return (
        <div className="card">
          <ScratchArea ref={scratchCardRefs[0]} value={card[0]} />
          <ScratchArea ref={scratchCardRefs[1]} value={card[1]} />
          <ScratchArea ref={scratchCardRefs[2]} value={card[2]} />
          <ScratchArea ref={scratchCardRefs[3]} value={card[3]} />
        </div>
      );
});

export default ScratchCard