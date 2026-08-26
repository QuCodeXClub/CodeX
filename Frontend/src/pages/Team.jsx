import React, { useState, useEffect } from "react";
import { Filter, Users, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicTeam } from "../context/teamSlice";
import { AdminTeamCardSkeleton } from "../components/common/skeletons";
import { TeamMemberCard } from "../components/common/TeamMemberCard";
import PageContainer from "../components/common/PageContainer";
import { generateAcademicYears } from "../utils/helpers";

const formAcademicYears = generateAcademicYears();

const Team = () => {
  const dispatch = useDispatch();
  const { membersByYear, loading } = useSelector((state) => state.team);
  const [filterYear, setFilterYear] = useState(formAcademicYears[0]);

  useEffect(() => {
    if (filterYear && !membersByYear[filterYear]) {
      dispatch(fetchPublicTeam(filterYear));
    }
  }, [dispatch, filterYear, membersByYear]);

  const members = membersByYear[filterYear] || [];

  const displayedMembers = [...members].sort(
    (a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0)
  );

  const adminTeam = displayedMembers.filter((m) => m.subTeam === "Admin Team");
  const coreTeam = displayedMembers.filter((m) => m.subTeam === "Core Team");
  const techTeam = displayedMembers.filter((m) => m.subTeam === "Tech Team");
  const graphicTeam = displayedMembers.filter(
    (m) => m.subTeam === "Graphic Team"
  );

  const renderTeamSection = (title, teamMembers) => {
    if (!teamMembers || teamMembers.length === 0) return null;

    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h2 className="text-2xl font-display font-bold uppercase text-text tracking-wide">
            {title}
          </h2>
          <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
            {teamMembers.length} MEMBERS
          </span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {teamMembers.map((member) => (
            <div key={member._id} className="w-full">
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="team-page min-h-screen bg-transparent relative font-sans pb-24">
      <div className="relative z-10 pt-8 lg:pt-12">
        <PageContainer>
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-border/80 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MEET THE TEAM</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-black text-text uppercase tracking-tight">
                CODEX <span className="text-accent">ROSTER</span>
              </h1>
              <p className="text-sm text-text-muted mt-2">
                Meet the passionate leaders, engineers, and creators driving CodeX forward.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative min-w-[220px]">
                <Filter className="absolute left-3.5 top-3 w-4 h-4 text-accent pointer-events-none" />
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="appearance-none bg-card border border-border/80 text-text font-mono text-xs rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:border-accent hover:border-border transition-all cursor-pointer w-full shadow-sm"
                >
                  {formAcademicYears.map((year) => (
                    <option key={year} value={year}>
                      AY {year}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none" />
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex flex-col gap-12 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <AdminTeamCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : members.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center shadow-sm w-full border border-dashed border-border">
              <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-bold font-display uppercase text-text mb-1">
                No Team Members Found
              </h3>
              <p className="text-text-muted text-xs font-mono">
                No roster records available for Academic Year {filterYear}.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-14 w-full">
              {renderTeamSection("Admin Team", adminTeam)}
              {renderTeamSection("Core Team", coreTeam)}
              {renderTeamSection("Tech Team", techTeam)}
              {renderTeamSection("Graphic & Media Team", graphicTeam)}
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
};

export default Team;
