
import React from 'react';

type Props = {
  inputs: React.ReactNode;
  results: React.ReactNode;
  chart?: React.ReactNode;
  footnote?: React.ReactNode;
  inputsTitle?: string;
  resultsTitle?: string;
};

export default function PanelShell({
  inputs,
  results,
  chart,
  footnote,
  inputsTitle = 'Your numbers',
  resultsTitle,
}: Props) {
  return (
    <div className="pshell">
      <div className="pshell__grid">
        <div className="pshell__inputs">
          <h3 className="pshell__label">{inputsTitle}</h3>
          {inputs}
        </div>

        <div className="pshell__results">
          {resultsTitle ? <h3 className="pshell__label">{resultsTitle}</h3> : null}
          {results}
          {chart ? <div className="pshell__chart">{chart}</div> : null}
        </div>
      </div>
      {footnote ? <p className="pshell__note">{footnote}</p> : null}
    </div>
  );
}
