import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileBadge,
  CreditCard,
  Calendar,
  Globe,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PIIEntity, PIIEntityType } from '../types';

interface PIITableProps {
  entities: PIIEntity[];
  onRedactEntity: (id: string) => void;
  onRestoreEntity: (id: string) => void;
  onIgnoreEntity: (id: string) => void;
  selectedEntityIds: Set<string>;
  onToggleSelectEntity: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRedactSelected: () => void;
  onRedactAll?: () => void;
}

export const PIITable: React.FC<PIITableProps> = ({
  entities,
  onRedactEntity,
  onRestoreEntity,
  onIgnoreEntity,
  selectedEntityIds,
  onToggleSelectEntity,
  onSelectAll,
  onDeselectAll,
  onRedactSelected,
  onRedactAll,
}) => {
  // Map of entity ID to boolean indicating if the user explicitly clicked to reveal masked value
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getEntityIcon = (type: PIIEntityType) => {
    switch (type) {
      case 'PERSON_NAME':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-emerald-500" />;
      case 'PHONE':
        return <Phone className="w-4 h-4 text-indigo-500" />;
      case 'ADDRESS':
        return <MapPin className="w-4 h-4 text-amber-500" />;
      case 'GOV_ID':
        return <FileBadge className="w-4 h-4 text-red-500" />;
      case 'ACCOUNT_NUMBER':
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'CREDIT_CARD':
        return <CreditCard className="w-4 h-4 text-rose-500" />;
      case 'DOB':
        return <Calendar className="w-4 h-4 text-teal-500" />;
      case 'URL':
        return <Globe className="w-4 h-4 text-cyan-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: PIIEntity['status']) => {
    switch (status) {
      case 'redacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Redacted
          </span>
        );
      case 'ignored':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Ignored
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <ShieldAlert className="w-3 h-3" />
            Pending Redaction
          </span>
        );
    }
  };

  const allSelected = entities.length > 0 && selectedEntityIds.size === entities.length;

  if (entities.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
        <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No sensitive entities detected yet
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Upload a document or click &ldquo;Load Demo Document&rdquo; to run local PII analysis.
        </p>
      </div>
    );
  }

  const selectedCount = selectedEntityIds.size;

  return (
    <div className="space-y-3">
      {/* Batch Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => (e.target.checked ? onSelectAll() : onDeselectAll())}
            className="w-4 h-4 rounded-sm text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-700 cursor-pointer"
            id="select-all-pii"
          />
          <label htmlFor="select-all-pii" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            Select All ({entities.length} entities)
          </label>
          {selectedCount > 0 && (
            <span className="text-slate-500">({selectedCount} selected)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onRedactSelected}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Redact Selected ({selectedCount})
            </button>
          )}

          {onRedactAll && (
            <button
              type="button"
              onClick={onRedactAll}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Redact all detected sensitive entities"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Redact All</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-3 w-10 text-center">
                <span className="sr-only">Select</span>
              </th>
              <th className="p-3">Entity Type</th>
              <th className="p-3">Protected Value</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {entities.map((entity) => {
              const isSelected = selectedEntityIds.has(entity.id);
              const isRevealed = Boolean(revealedIds[entity.id]);

              return (
                <tr
                  key={entity.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    isSelected ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectEntity(entity.id)}
                      className="w-4 h-4 rounded-sm text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                  </td>

                  {/* Entity Type */}
                  <td className="p-3 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                        {getEntityIcon(entity.type)}
                      </div>
                      <div>
                        <span className="font-semibold">{entity.label}</span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {entity.type}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Masked / Protected Value */}
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">
                        {isRevealed ? entity.rawValue : entity.maskedValue}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(entity.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title={
                          isRevealed
                            ? 'Hide raw value'
                            : 'Cautiously inspect unmasked value (Temporary verification)'
                        }
                      >
                        {isRevealed ? (
                          <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Confidence */}
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${entity.confidence}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {entity.confidence}%
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3">{getStatusBadge(entity.status)}</td>

                  {/* Action */}
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {entity.status !== 'redacted' ? (
                        <button
                          onClick={() => onRedactEntity(entity.id)}
                          className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer"
                        >
                          Redact
                        </button>
                      ) : (
                        <button
                          onClick={() => onRestoreEntity(entity.id)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restore
                        </button>
                      )}

                      {entity.status === 'pending' && (
                        <button
                          onClick={() => onIgnoreEntity(entity.id)}
                          className="px-2 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                          title="Ignore (False positive / intentional public mention)"
                        >
                          Ignore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
