// ============================================
// LIB/CREW-RECOMMENDATION.TS
// ============================================
// 🆕 NUEVO - Copiar a: CleanMasters2/lib/crew-recommendation.ts

export interface CrewRecommendation {
  members: any[]
  score: number
  reasoning: string[]
  warnings: string[]
}

export function recommendCrewMembers(
  availableMembers: any[],
  requiredRoles: {
    supervisors?: number
    teamLeaders?: number
    members?: number
  } = {
    supervisors: 1,
    teamLeaders: 1,
    members: 2
  }
): CrewRecommendation {
  const reasoning: string[] = []
  const warnings: string[] = []
  const selectedMembers: any[] = []
  
  const supervisors = availableMembers.filter(m => m.role === 'SUPERVISOR' && m.isActive)
  const teamLeaders = availableMembers.filter(m => m.role === 'TEAM_LEADER' && m.isActive)
  const regularMembers = availableMembers.filter(m => m.role === 'MEMBER' && m.isActive)
  
  if (requiredRoles.supervisors && requiredRoles.supervisors > 0) {
    const selected = supervisors.sort((a, b) => b.experience - a.experience).slice(0, requiredRoles.supervisors)
    selectedMembers.push(...selected)
    if (selected.length < requiredRoles.supervisors) {
      warnings.push(`Only found ${selected.length} supervisor(s), needed ${requiredRoles.supervisors}`)
    }
  }
  
  if (requiredRoles.teamLeaders && requiredRoles.teamLeaders > 0) {
    const selected = teamLeaders.sort((a, b) => b.experience - a.experience).slice(0, requiredRoles.teamLeaders)
    selectedMembers.push(...selected)
    if (selected.length < requiredRoles.teamLeaders) {
      warnings.push(`Only found ${selected.length} team leader(s)`)
    }
  }
  
  if (requiredRoles.members && requiredRoles.members > 0) {
    const sorted = [...regularMembers].sort((a, b) => b.experience - a.experience)
    const experiencedCount = Math.ceil(requiredRoles.members / 2)
    const selected = [
      ...sorted.slice(0, experiencedCount),
      ...sorted.slice(-Math.floor(requiredRoles.members / 2))
    ].slice(0, requiredRoles.members)
    selectedMembers.push(...selected)
  }
  
  const avgExperience = selectedMembers.reduce((sum, m) => sum + m.experience, 0) / selectedMembers.length
  reasoning.push(`Average experience: ${Math.round(avgExperience)} cleanings`)
  
  const score = Math.min(100, avgExperience / 2 + (selectedMembers.length >= 3 ? 20 : 0))
  
  return { members: selectedMembers, score, reasoning, warnings }
}

export function suggestCrewImprovements(
  currentMembers: any[],
  availableMembers: any[]
): string[] {
  const suggestions: string[] = []
  
  if (currentMembers.length === 0) {
    return ['Crew is empty. Add members to get started.']
  }
  
  const hasSupervisor = currentMembers.some(m => m.role === 'SUPERVISOR')
  if (!hasSupervisor) {
    suggestions.push('Add a supervisor to lead the team')
  }
  
  const avgExperience = currentMembers.reduce((sum, m) => sum + m.experience, 0) / currentMembers.length
  if (avgExperience < 30) {
    suggestions.push('Crew has low average experience. Consider adding experienced members.')
  }
  
  return suggestions.length > 0 ? suggestions : ['Crew composition looks good!']
}
