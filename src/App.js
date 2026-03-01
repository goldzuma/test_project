import React, { useState, useMemo } from 'react';
import { detectSums } from './utils';
import './App.css';

const parseInput = (raw) => {
  if (!raw.trim()) {
    return { numbers: null, error: 'Input is empty. Enter comma-separated numbers.' };
  }

  const tokens = raw.split(',').map(t => t.trim()).filter(t => t !== '');

  if (tokens.length === 0) {
    return { numbers: null, error: 'Input is empty. Enter comma-separated numbers.' };
  }

  const numbers = [];
  for (const token of tokens) {
    const n = Number(token);
    if (isNaN(n)) {
      return { numbers: null, error: `"${token}" is not a valid number.` };
    }
    numbers.push(n);
  }

  return { numbers, error: null };
};

export default function App() {
  const [value, setValue] = useState('');
  const [dirty, setDirty] = useState(false);

  const { numbers, error } = useMemo(() => parseInput(value), [value]);
  const results = useMemo(() => (numbers ? detectSums(numbers) : []), [numbers]);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (!dirty) setDirty(true);
  };

  const showError = dirty && !!error;
  const showResults = !error && numbers !== null;

  return (
    <div className="App">
      <div className="App-card">
        <h1 className="App-title">Detect Sums</h1>
        <p className="App-subtitle">
          Find all index triples <code>(pA, pB, sum)</code> where{' '}
          <code>A[pA] + A[pB] = A[sum]</code>
        </p>

        <div className={`App-input-wrapper${showError ? ' App-input-wrapper--error' : showResults ? ' App-input-wrapper--valid' : ''}`}>
          <input
            className="App-input"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="e.g. 1, 2, 3, 4, 5"
            aria-label="Comma-separated number array"
            aria-invalid={showError}
            aria-describedby={showError ? 'input-error' : undefined}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {showError && (
          <p className="App-error" id="input-error" role="alert">
            <span className="App-error-icon">&#9888;</span> {error}
          </p>
        )}

        {showResults && (
          <div className="App-results">
            <p className="App-results-summary">
              Input:{' '}
              <span className="App-array">
                [{numbers.map((n, i) => (
                  <span key={i} className="App-array-item">
                    {i > 0 && <span className="App-comma">, </span>}
                    <span className="App-index">A[{i}]</span>
                    <span className="App-num">{n}</span>
                  </span>
                ))}]
              </span>
            </p>

            {results.length === 0 ? (
              <p className="App-no-results">No matching sums found.</p>
            ) : (
              <>
                <p className="App-match-count">
                  {results.length} match{results.length === 1 ? '' : 'es'} found
                </p>
                <div className="App-table-wrapper">
                  <table className="App-table">
                    <thead>
                      <tr>
                        <th>pA</th>
                        <th>pB</th>
                        <th>sum</th>
                        <th>Equation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(({ pA, pB, sum }, i) => (
                        <tr key={i}>
                          <td><span className="App-badge">{pA}</span></td>
                          <td><span className="App-badge">{pB}</span></td>
                          <td><span className="App-badge App-badge--sum">{sum}</span></td>
                          <td className="App-equation">
                            <span className="App-eq-part">A[{pA}]<sub>{numbers[pA]}</sub></span>
                            <span className="App-op"> + </span>
                            <span className="App-eq-part">A[{pB}]<sub>{numbers[pB]}</sub></span>
                            <span className="App-op"> = </span>
                            <span className="App-eq-part App-eq-result">A[{sum}]<sub>{numbers[sum]}</sub></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
