import { useEffect, useRef, useState } from 'react';
import { useDebouncer } from '@tanstack/react-pacer';

const identity = <TValue>(value: TValue) => value;

export const useDebouncedControlledValue = <TDraft, TValue = TDraft>({
  value,
  onChange,
  wait = 400,
  format = identity as (value: TValue) => TDraft,
  parse = identity as (value: TDraft) => TValue,
}: I_UseDebouncedControlledValueParams<TDraft, TValue>) => {
  const formatRef = useRef(format);
  const parseRef = useRef(parse);
  const onChangeRef = useRef(onChange);

  formatRef.current = format;
  parseRef.current = parse;
  onChangeRef.current = onChange;

  const [draftValue, setDraftValueState] = useState<TDraft>(() => formatRef.current(value));
  const debouncer = useDebouncer(
    (nextDraftValue: TDraft) => {
      onChangeRef.current(parseRef.current(nextDraftValue));
    },
    { wait }
  );

  useEffect(() => {
    debouncer.cancel();
    setDraftValueState(formatRef.current(value));
  }, [debouncer, value]);

  const setDraftValue = (nextDraftValue: TDraft) => {
    setDraftValueState(nextDraftValue);
    debouncer.maybeExecute(nextDraftValue);
  };

  return {
    draftValue,
    setDraftValue,
  };
};

interface I_UseDebouncedControlledValueParams<TDraft, TValue = TDraft> {
  value: TValue;
  onChange: (value: TValue) => void;
  wait?: number;
  format?: (value: TValue) => TDraft;
  parse?: (value: TDraft) => TValue;
}
