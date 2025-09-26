import React, { useState } from 'react'
import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'

const ExportPanel = ({ gapData, jobMatches, learningPath }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')

  const exportToPDF = async () => {
    setIsExporting(true)
    
    try {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.width
      const margin = 20
      let yPosition = margin

      // Title
      pdf.setFontSize(20)
      pdf.text('Gap Analysis Report', margin, yPosition)
      yPosition += 15

      // Date
      pdf.setFontSize(10)
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition)
      yPosition += 15

      // Overall Score
      if (gapData) {
        pdf.setFontSize(16)
        pdf.text('Overall Analysis', margin, yPosition)
        yPosition += 10
        
        pdf.setFontSize(12)
        pdf.text(`Overall Skill Match: ${Math.round(gapData.overallGapScore || 0)}%`, margin, yPosition)
        yPosition += 8
        
        // Critical Gaps
        if (gapData.criticalGaps && gapData.criticalGaps.length > 0) {
          pdf.text('Critical Skills Needed:', margin, yPosition)
          yPosition += 6
          
          gapData.criticalGaps.slice(0, 10).forEach((gap, index) => {
            pdf.setFontSize(10)
            pdf.text(`• ${gap.skill} (Gap: ${gap.gap} levels, Impact: $${gap.salaryImpact?.toLocaleString()})`, margin + 10, yPosition)
            yPosition += 5
          })
          yPosition += 5
        }

        // Strengths
        if (gapData.strengths && gapData.strengths.length > 0) {
          pdf.setFontSize(12)
          pdf.text('Your Strengths:', margin, yPosition)
          yPosition += 6
          
          pdf.setFontSize(10)
          pdf.text(gapData.strengths.join(', '), margin + 10, yPosition)
          yPosition += 10
        }
      }

      // Job Matches
      if (jobMatches && jobMatches.length > 0) {
        pdf.setFontSize(16)
        pdf.text('Top Job Matches', margin, yPosition)
        yPosition += 10
        
        jobMatches.slice(0, 5).forEach((match, index) => {
          pdf.setFontSize(12)
          pdf.text(`${match.job.title} at ${match.job.company.name}`, margin, yPosition)
          yPosition += 6
          
          pdf.setFontSize(10)
          pdf.text(`Match Score: ${Math.round(match.matchScore)}%`, margin + 10, yPosition)
          yPosition += 4
          
          if (match.job.salary) {
            pdf.text(`Salary: $${match.job.salary.min?.toLocaleString()} - $${match.job.salary.max?.toLocaleString()}`, margin + 10, yPosition)
            yPosition += 4
          }
          
          yPosition += 3
        })
      }

      // Learning Path
      if (learningPath && learningPath.phases) {
        pdf.setFontSize(16)
        pdf.text('Learning Path Recommendations', margin, yPosition)
        yPosition += 10
        
        pdf.setFontSize(12)
        pdf.text(`Total Estimated Time: ${learningPath.totalEstimatedTime}`, margin, yPosition)
        yPosition += 8
        
        learningPath.phases.slice(0, 3).forEach((phase, index) => {
          pdf.setFontSize(11)
          pdf.text(`Phase ${index + 1}: ${phase.phase}`, margin, yPosition)
          yPosition += 5
          
          pdf.setFontSize(10)
          pdf.text(`Duration: ${phase.duration}`, margin + 10, yPosition)
          yPosition += 4
          
          pdf.text(`Skills: ${phase.skills.join(', ')}`, margin + 10, yPosition)
          yPosition += 6
        })
      }

      // Save the PDF
      pdf.save(`gap-analysis-report-${Date.now()}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF report. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToCSV = () => {
    setIsExporting(true)
    
    try {
      let csvContent = 'Gap Analysis Report\n\n'
      csvContent += `Generated on,${new Date().toLocaleDateString()}\n\n`
      
      // Overall metrics
      if (gapData) {
        csvContent += 'Overall Analysis\n'
        csvContent += `Overall Skill Match,${Math.round(gapData.overallGapScore || 0)}%\n\n`
        
        // Critical gaps
        if (gapData.criticalGaps && gapData.criticalGaps.length > 0) {
          csvContent += 'Critical Skills Needed\n'
          csvContent += 'Skill,Gap Level,Learning Time,Salary Impact\n'
          
          gapData.criticalGaps.forEach(gap => {
            csvContent += `"${gap.skill}",${gap.gap},"${gap.learningTime}",${gap.salaryImpact || 0}\n`
          })
          csvContent += '\n'
        }
      }
      
      // Job matches
      if (jobMatches && jobMatches.length > 0) {
        csvContent += 'Job Matches\n'
        csvContent += 'Job Title,Company,Match Score,Min Salary,Max Salary,Location\n'
        
        jobMatches.forEach(match => {
          const location = match.job.location.remote ? 'Remote' : `${match.job.location.city}, ${match.job.location.state}`
          csvContent += `"${match.job.title}","${match.job.company.name}",${Math.round(match.matchScore)}%,${match.job.salary?.min || 0},${match.job.salary?.max || 0},"${location}"\n`
        })
      }
      
      // Create and download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, `gap-analysis-report-${Date.now()}.csv`)
      
    } catch (error) {
      console.error('Error generating CSV:', error)
      alert('Error generating CSV report. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      exportToPDF()
    } else {
      exportToCSV()
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="pdf">PDF Report</option>
        <option value="csv">CSV Data</option>
      </select>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          isExporting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isExporting ? (
          <span className="flex items-center space-x-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Exporting...</span>
          </span>
        ) : (
          `Export ${exportFormat.toUpperCase()}`
        )}
      </button>
    </div>
  )
}

export default ExportPanel