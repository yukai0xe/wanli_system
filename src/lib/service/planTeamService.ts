import * as utility from '@/lib/utility';
import { User } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';
import { Gender, TeamRole } from '@prisma/client'
import { initialEventStats } from '@/state/planTeamStore'

class PlanTeamService {
  static async getPlanTeamMetas(profileId: string) {
    try {
      return await prisma.planTeamMeta.findMany({
        where: { belongProfileId: profileId },
        select: {
          id: true,
          planTeamId: true,
          mainName: true,
          duration: true,
          prepareDate: true,
          startDate: true,
          leader: {
            select: {
              id: true,
              name: true,
            }
          },
          guide: {
            select: {
              id: true,
              name: true,
            }
          },
          staybehind: {
            select: {
              id: true,
              name: true,
            }
          },
          stats: true,
          teamSize: true,
          eventState: true,
        },
      });
    } catch (error) {
      console.error('Error fetching PlanTeamMetas by profileId:', error);
      throw error;
    }
  }

  static async getPlanTeamById(id: number) {
    try {
      const data = await prisma.planTeam.findUnique({
        where: { id },
        include: {
          members: true,
          planTeamMeta: true
        }
      });
      if (!data) return null;
      const { planTeamMeta, ...team } = data;
      return { team, planTeamMeta };
    } catch (error) {
      console.error('Error fetching PlanTeam by id:', error);
      throw error;
    }
  }

  static async createPlanTeam(data: PlanTeam) {
    try {
      return await prisma.planTeam.create({
        data: {
          mainName: data.mainName,
          mainDescription: data.mainDescription,
          type: data.type,
          dateType: data.dateType,
          startDate: data.startDate,
          endDate: data.endDate,
          prepareDate: data.prepareDate,
          expectedTeamSize: data.expectedTeamSize ?? null,
          transportType: data.transportType,
          members: {
            create: data.members.map(member => {
              // const roleTypeEnumKey = utility.parseEnumKey(TeamRole, member.role);
              // if (!roleTypeEnumKey) throw new Error(`Invalid role value: ${member.role}`);
              // const genderTypeEnumKey = utility.parseEnumKey(Gender, member.gender);
              return {
                  ...member,
                  role: member.role,
                  birth: member.birth ? new Date(member.birth) : null,
                  gender: member.gender ?? null
                }
              }
            )
          },
        },
      });
    } catch (error) {
      console.error('Error creating PlanTeam:', error);
      throw error;
    }
  }

  static async createPlanTeamMeta(id: number, data: PlanTeam, user: User) {
    const teamStats: TeamStats = {
      male: 0,
      female: 0,
      clubexec: 0,
      nonClubexec: 0,
      new: 0,
      old: 0
    }

    data.members.forEach(m => {
      if (m.gender === Gender.Male) teamStats.male++;
      if (m.gender === Gender.Female) teamStats.female++;
      if (m.role !== TeamRole.NormalMember) teamStats.clubexec++;
      else teamStats.nonClubexec++;
      // new, old
    })

    try {
      return await prisma.planTeamMeta.create({
        data: {
          planTeamId: id,
          mainName: data.mainName,
          duration: utility.calculateDuration(data.startDate, data.endDate),
          prepareDate: data.prepareDate,
          leaderId: data.members.find(m => m.role === TeamRole.Leader)?.id,
          guideId: data.members.find(m => m.role === TeamRole.Guide)?.id,
          staybehindId: data.members.find(m => m.role === TeamRole.StayBehind)?.id,
          stats: teamStats,
          teamSize: data.members.length,
          startDate: data.startDate.toLocaleString(),
          eventState: initialEventStats,
          belongProfileId: user.id ?? null,
        },
      });
    } catch (error) {
      console.error('Error creating PlanTeamMeta:', error);
      throw error;
    }
  }
}

export default PlanTeamService;
