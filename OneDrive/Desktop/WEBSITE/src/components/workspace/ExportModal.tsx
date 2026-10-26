import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Printer,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Project, ProductionPlan } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../common/Toast';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  plan: ProductionPlan;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  plan,
}) => {
  const [includeCompletePlan, setIncludeCompletePlan] = useState(true);
  const [includeShotList, setIncludeShotList] = useState(true);
  const [includeProps, setIncludeProps] = useState(true);
  const [includeBroll, setIncludeBroll] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);

  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'clipboard'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const toast = useToast();

  const handleExport = () => {
    setIsExporting(true);

    try {
      if (selectedFormat === 'clipboard') {
        exportToClipboard();
      } else if (selectedFormat === 'csv') {
        exportToCsv();
      } else if (selectedFormat === 'pdf') {
        exportToPdf();
      }
    } catch (err) {
      console.error(err);
      toast.error('Export Error', 'Failed to generate export file.');
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const exportToClipboard = () => {
    let content = `# FRAMEFLOW AI — PRODUCTION PLAN\n\n`;
    content += `**Project:** ${project.title}\n`;
    content += `**Platform:** ${project.platform} | **Target Duration:** ${plan.summary.totalDuration} | **Tone:** ${project.tones.join(', ')}\n\n`;

    if (includeTimeline) {
      content += `## PRODUCTION TIMELINE\n`;
      plan.timeline.forEach((t) => {
        content += `- [${t.timestamp}] Scene ${t.sceneNumber}: ${t.title} (${t.duration})\n`;
      });
      content += `\n`;
    }

    if (includeCompletePlan) {
      content += `## SCENES BREAKDOWN\n`;
      plan.scenes.forEach((scene) => {
        content += `### Scene ${scene.sceneNumber}: ${scene.title} (${scene.duration})\n`;
        content += `- **Location:** ${scene.location}\n`;
        content += `- **Dialogue:** "${scene.dialogue}"\n`;
        content += `- **Visual:** ${scene.visualDescription}\n`;
        content += `- **Camera Direction:** ${scene.cameraDirectionSummary} (Lens: ${scene.cameraDetails.lensSuggestion})\n`;
        content += `- **Lighting:** ${scene.lighting}\n`;
        content += `- **Props:** ${scene.props.join(', ')}\n\n`;
      });
    }

    if (includeShotList) {
      content += `## SHOT LIST TABLE\n`;
      content += `| Shot | Scene | Shot Type | Camera Movement | Subject | Duration | Audio |\n`;
      content += `|---|---|---|---|---|---|---|\n`;
      plan.scenes.flatMap((s) => s.shots).forEach((shot) => {
        content += `| Shot ${shot.shotNumber.toString().padStart(2, '0')} | Scene ${shot.sceneNumber} | ${shot.shotType} | ${shot.cameraMovement} | ${shot.subject} | ${shot.duration} | ${shot.audio} |\n`;
      });
      content += `\n`;
    }

    if (includeProps) {
      content += `## PROPS & EQUIPMENT CHECKLIST\n`;
      plan.propsAndEquipment.forEach((p) => {
        content += `- [${p.prepared ? 'X' : ' '}] ${p.name} (${p.category})${p.notes ? ` - Note: ${p.notes}` : ''}\n`;
      });
      content += `\n`;
    }

    if (includeBroll) {
      content += `## B-ROLL CUTAWAY PLAN\n`;
      plan.brollClips.forEach((clip) => {
        content += `- Clip ${clip.clipNumber.toString().padStart(2, '0')} (Scene ${clip.sceneNumber}, ${clip.suggestedDuration}): ${clip.visual} | Camera: ${clip.camera} | Audio: ${clip.audio}\n`;
      });
      content += `\n`;
    }

    navigator.clipboard.writeText(content);
    toast.success('Copied to Clipboard!', 'Complete production plan copied in formatted Markdown.');
  };

  const exportToCsv = () => {
    // Generate CSV for Shot List and Props
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Shot Number,Scene Number,Shot Type,Camera Movement,Lens Suggestion,Subject,Duration,Audio Cue\n';

    plan.scenes.flatMap((s) => s.shots).forEach((shot) => {
      const row = [
        `"Shot ${shot.shotNumber}"`,
        `"Scene ${shot.sceneNumber}"`,
        `"${shot.shotType}"`,
        `"${shot.cameraMovement}"`,
        `"${shot.lensSuggestion || ''}"`,
        `"${shot.subject.replace(/"/g, '""')}"`,
        `"${shot.duration}"`,
        `"${shot.audio.replace(/"/g, '""')}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.setAttribute('download', `${safeTitle}-shot-list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV Download Started', `Saved "${safeTitle}-shot-list.csv" to downloads.`);
  };

  const exportToPdf = () => {
    // Open clean print window for PDF export
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.warning('Popup Blocked', 'Please allow popups to open the printable PDF document.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${project.title} — FrameFlow AI Production Blueprint</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #0f172a; padding: 40px; margin: 0; }
          h1 { color: #4338ca; font-size: 26px; margin-bottom: 4px; }
          .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0; }
          .badge { background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; }
          .scene { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 18px; page-break-inside: avoid; }
          .scene-header { font-weight: bold; font-size: 16px; color: #1e293b; margin-bottom: 6px; }
          .dialogue { font-style: italic; background: #f8fafc; padding: 10px; border-left: 3px solid #6366f1; border-radius: 4px; margin: 8px 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background: #f1f5f9; color: #334155; font-weight: bold; }
          .checklist { list-style: none; padding-left: 0; font-size: 13px; }
          .checklist li { margin-bottom: 6px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>${project.title}</h1>
        <div class="meta">
          <span class="badge">${project.platform}</span> · 
          <strong>Duration:</strong> ${plan.summary.totalDuration} · 
          <strong>Tone:</strong> ${project.tones.join(', ')} · 
          <strong>Generated with FrameFlow AI</strong>
        </div>

        ${
          includeCompletePlan
            ? `
          <h2>Scene Breakdown (${plan.scenes.length} Scenes)</h2>
          ${plan.scenes
            .map(
              (s) => `
            <div class="scene">
              <div class="scene-header">Scene ${s.sceneNumber}: ${s.title} (${s.duration}) — Location: ${s.location}</div>
              <div class="dialogue">"${s.dialogue}"</div>
              <p><strong>Visual:</strong> ${s.visualDescription}</p>
              <p><strong>Camera Direction:</strong> ${s.cameraDirectionSummary} (Lens: ${s.cameraDetails.lensSuggestion}, Framing: ${s.cameraDetails.framing})</p>
              <p><strong>Lighting:</strong> ${s.lighting}</p>
              <p><strong>Props:</strong> ${s.props.join(', ')}</p>
            </div>
          `
            )
            .join('')}
        `
            : ''
        }

        ${
          includeShotList
            ? `
          <h2>Production Shot List (${plan.scenes.flatMap((s) => s.shots).length} Shots)</h2>
          <table>
            <thead>
              <tr>
                <th>Shot</th><th>Scene</th><th>Shot Type</th><th>Camera Movement</th><th>Lens</th><th>Subject</th><th>Duration</th><th>Audio</th>
              </tr>
            </thead>
            <tbody>
              ${plan.scenes
                .flatMap((s) => s.shots)
                .map(
                  (sh) => `
                <tr>
                  <td><strong>Shot ${sh.shotNumber.toString().padStart(2, '0')}</strong></td>
                  <td>Scene ${sh.sceneNumber}</td>
                  <td>${sh.shotType}</td>
                  <td>${sh.cameraMovement}</td>
                  <td>${sh.lensSuggestion || ''}</td>
                  <td>${sh.subject}</td>
                  <td>${sh.duration}</td>
                  <td>${sh.audio}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        `
            : ''
        }

        ${
          includeProps
            ? `
          <h2 style="margin-top: 24px;">Props & Production Equipment Checklist</h2>
          <ul class="checklist">
            ${plan.propsAndEquipment
              .map(
                (p) => `
              <li>[ ${p.prepared ? '✓' : ' '} ] <strong>${p.name}</strong> (${p.category})${p.notes ? ` — ${p.notes}` : ''}</li>
            `
              )
              .join('')}
          </ul>
        `
            : ''
        }

        ${
          includeBroll
            ? `
          <h2 style="margin-top: 24px;">B-Roll Cutaway Plan</h2>
          <ul class="checklist">
            ${plan.brollClips
              .map(
                (c) => `
              <li><strong>Clip ${c.clipNumber.toString().padStart(2, '0')}</strong> (${c.suggestedDuration}, Scene ${c.sceneNumber}): ${c.visual} [Camera: ${c.camera}]</li>
            `
              )
              .join('')}
          </ul>
        `
            : ''
        }

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    toast.success('Print Document Ready', 'Opening browser print dialog to save as PDF.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Production Plan"
      description="Choose the components and format to export for your production crew or on-set guide."
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="ai"
            leftIcon={<Download className="w-4 h-4" />}
            isLoading={isExporting}
            onClick={handleExport}
            className="shadow-glow"
          >
            Export Plan ({selectedFormat.toUpperCase()})
          </Button>
        </>
      }
    >
      <div className="space-y-5 py-2 text-left text-xs">
        {/* Sections Checklist (Section 24 of prompt) */}
        <div>
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2.5">
            Select Sections to Include
          </span>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeCompletePlan}
                onChange={(e) => setIncludeCompletePlan(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block">Complete Production Plan</span>
                <span className="text-[11px] text-slate-500">All 6 scene breakdowns, dialogue lines, locations, and visual descriptions</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeShotList}
                onChange={(e) => setIncludeShotList(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block">Shot List Table</span>
                <span className="text-[11px] text-slate-500">18 camera shots with movements, lenses, angles, and durations</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeProps}
                onChange={(e) => setIncludeProps(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block">Props & Equipment Checklist</span>
                <span className="text-[11px] text-slate-500">Props, camera gear, lighting, and audio equipment</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeBroll}
                onChange={(e) => setIncludeBroll(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block">B-Roll Cutaway Plan</span>
                <span className="text-[11px] text-slate-500">10 tactile visual insert cards with audio notes</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeTimeline}
                onChange={(e) => setIncludeTimeline(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block">Production Timeline Schedule</span>
                <span className="text-[11px] text-slate-500">Chronological timestamp cue sheet (00:00 — 01:00)</span>
              </div>
            </label>
          </div>
        </div>

        {/* Export Formats Selector (PDF, CSV, Clipboard) */}
        <div>
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2.5">
            Export Format
          </span>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedFormat('pdf')}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                selectedFormat === 'pdf'
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Printer className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-xs">PDF Document</span>
              <span className="text-[10px] text-slate-400">Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('csv')}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                selectedFormat === 'csv'
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-xs">CSV Spreadsheet</span>
              <span className="text-[10px] text-slate-400">Excel / Sheets</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('clipboard')}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                selectedFormat === 'clipboard'
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Copy className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-xs">Clipboard</span>
              <span className="text-[10px] text-slate-400">Copy Markdown</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
