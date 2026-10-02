import React, { useState, useRef } from 'react';
import { Shield, RefreshCw, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Transaction } from '../types';

interface Props {
  transaction: Transaction;
}

export const OTPVerification: React.FC<Props> = ({ transaction }) => {
  const { updateTransaction, incrementStat, addToast } = useAppStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [verifyResult, setVerifyResult] = useState<null | 'success' | 'failed'>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const demoPhone = transaction.demoPhone || '+91 98765****210';
  const correctOtp = transaction.otpCode || '000000';
  const maxAttempts = transaction.otpMaxAttempts || 3;

  const isApproved = transaction.status === 'approved' || transaction.status === 'otp_verified';
  const isBlocked = transaction.status === 'blocked';

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    if (pasted.length > 0) {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      addToast({ message: 'Please enter all 6 digits', type: 'warning' });
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (entered === correctOtp) {
      setVerifyResult('success');
      updateTransaction(transaction.id, { status: 'otp_verified' });
      setTimeout(() => {
        updateTransaction(transaction.id, { status: 'approved' });
        incrementStat('approved');
        incrementStat('otpVerified');
        addToast({ message: `OTP verified — ${transaction.customerName}'s transaction approved`, type: 'success' });
      }, 800);
    } else if (newAttempts >= maxAttempts) {
      setVerifyResult('failed');
      updateTransaction(transaction.id, { status: 'blocked' });
      incrementStat('blocked');
      incrementStat('otpFailed');
      addToast({ message: `Transaction blocked — failed verification for ${transaction.customerName}`, type: 'error' });
    } else {
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
      addToast({
        message: `Incorrect OTP. ${maxAttempts - newAttempts} attempt(s) remaining.`,
        type: 'warning',
      });
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setAttempts(0);
    setVerifyResult(null);
    addToast({ message: 'OTP resent (Demo simulation)', type: 'info' });
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  };

  if (isApproved || verifyResult === 'success') {
    return (
      <div className="flex flex-col items-center gap-2 py-3">
        <CheckCircle size={24} className="text-green-400" />
        <div className="text-xs font-semibold text-green-400">Identity Verified Successfully</div>
        <div className="text-[10px] text-slate-500">Transaction has been approved.</div>
      </div>
    );
  }

  if (isBlocked || verifyResult === 'failed') {
    return (
      <div className="flex flex-col items-center gap-2 py-3">
        <XCircle size={24} className="text-red-400" />
        <div className="text-xs font-semibold text-red-400">Verification Failed</div>
        <div className="text-[10px] text-slate-500 text-center">
          Suspicious transaction blocked after failed verification.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <Shield size={13} className="text-orange-400" />
        <span className="text-[11px] font-semibold text-orange-400">OTP Verification Required</span>
      </div>

      <div>
        <div className="text-[10px] text-slate-500">6-digit code sent to</div>
        <div className="text-xs font-mono text-slate-200 mt-0.5">{demoPhone}</div>
      </div>

      <div className="flex gap-1.5" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-9 h-10 text-center text-sm font-mono font-bold bg-navy-900 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        ))}
      </div>

      {attempts > 0 && (
        <div className="text-[10px] text-amber-400">
          {maxAttempts - attempts} attempt(s) remaining
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleVerify}
          disabled={otp.join('').length < 6}
          className="flex-1 py-1.5 text-[11px] font-semibold rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
        >
          VERIFY OTP
        </button>
        <button
          onClick={handleResend}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
        >
          <RefreshCw size={9} /> RESEND
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowOtp(!showOtp)}
          className="flex items-center gap-1 text-[9px] text-slate-600 hover:text-slate-400 transition-colors"
        >
          {showOtp ? <EyeOff size={9} /> : <Eye size={9} />}
          {showOtp ? 'Hide' : 'Show'} demo OTP
        </button>
        {showOtp && (
          <div className="text-[10px] font-mono bg-navy-700/80 px-2 py-1 rounded text-green-400 border border-green-800/40">
            {correctOtp}
          </div>
        )}
      </div>
    </div>
  );
};
