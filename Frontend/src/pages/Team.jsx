import React, { useState, useEffect } from "react";
import { Filter, Users, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchPublicTeam } from "../context/teamSlice";
import { AdminTeamCardSkeleton } from "../components/common/skeletons";
import { TeamMemberCard } from "../components/common/TeamMemberCard";
import PageContainer from "../components/common/PageContainer";
import { generateAcademicYears } from "../utils/helpers";
import teamsData from "../data/teams.json";
import { ASSETS } from "../config/assets";

const formAcademicYears = generateAcademicYears();

const Team = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { membersByYear, loading } = useSelector((state) => state.team);
  const [filterYear, setFilterYear] = useState(formAcademicYears[0]);

  useEffect(() => {
    if (filterYear && !membersByYear[filterYear]) {
      dispatch(fetchPublicTeam(filterYear));
    }
  }, [dispatch, filterYear, membersByYear]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) {
          const navbarOffset = window.innerWidth < 768 ? 56 : 64;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = Math.max(0, Math.floor(elementPosition - navbarOffset));
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.state]);

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

  const renderTeamSection = (title, teamMembers, id) => {
    if (!teamMembers || teamMembers.length === 0) return null;

    return (
      <div className="w-full" id={id}>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-display font-bold uppercase text-text tracking-wide">
            {title}
          </h2>
          <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
            {teamMembers.length} MEMBERS
          </span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-0.66rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]"
            >
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const mappedUniversityLeadership = teamsData.universityLeadership.map((item, index) => ({
    _id: `uni-${index}`,
    name: item.name,
    post: item.designation,
    photo: ASSETS.IMAGES.UNIVERSITY_LEADERSHIP?.[item.imageKey] || null
  }));

  const mappedCA = teamsData.computerApplications.map((item, index) => ({
    _id: `ca-${index}`,
    name: item.name,
    post: item.designation,
    photo: ASSETS.IMAGES.UNIVERSITY_LEADERSHIP?.[item.imageKey] || null
  }));

  const mappedClubLeadership = teamsData.clubLeadership.map((item, index) => ({
    _id: `club-${index}`,
    name: item.name,
    post: item.designation,
    photo: ASSETS.IMAGES.CLUB_FACULTY_LEADERSHIP?.[item.imageKey] || null
  }));

  const mappedFacultyMentors = teamsData.facultyMentors.map((item, index) => ({
    _id: `fac-${index}`,
    name: item.name,
    post: item.designation,
    photo: ASSETS.IMAGES.FACULTY_MENTORS?.[item.imageKey] || null
  }));

  const renderBentoBox = (title, teamMembers, id, className = "", colorTheme = "blue") => {
    if (!teamMembers || teamMembers.length === 0) return null;

    const themeMap = {
      blue: { bg: "dark:bg-blue-500/5", glow: "bg-blue-500/10", dot: "bg-blue-500", text: "text-blue-500", border: "border-blue-500/20", badgeBg: "bg-blue-500/10" },
      emerald: { bg: "dark:bg-emerald-500/5", glow: "bg-emerald-500/10", dot: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/20", badgeBg: "bg-emerald-500/10" },
      amber: { bg: "dark:bg-amber-500/5", glow: "bg-amber-500/10", dot: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/20", badgeBg: "bg-amber-500/10" },
      purple: { bg: "dark:bg-purple-500/5", glow: "bg-purple-500/10", dot: "bg-purple-500", text: "text-purple-500", border: "border-purple-500/20", badgeBg: "bg-purple-500/10" }
    };
    const theme = themeMap[colorTheme] || themeMap.blue;

    return (
      <div id={id} className={`bg-card/5 ${theme.bg} backdrop-blur-xl shadow-xl border border-border/40 rounded-3xl p-6 lg:p-8 flex flex-col relative overflow-hidden transition-colors duration-300 ${className}`}>

        <div className="flex items-center justify-center mb-8 relative z-10 w-full">
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-text tracking-wide text-center">
            {title}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 relative z-10">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-0.75rem)] md:w-[calc(25%-1.125rem)] lg:flex-1 lg:min-w-[160px] lg:max-w-[260px] flex-grow-0 lg:flex-grow"
            >
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
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6  pb-8">
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
          </header>

          {loading ? (
            <div className="flex flex-col gap-12 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <AdminTeamCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-14 w-full">
              {/* Bento Grid for Leadership */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                {renderBentoBox("University / QST Leadership", mappedUniversityLeadership, "university-leadership", "lg:col-span-6", "blue")}
                {renderBentoBox("Computer Applications (CA)", mappedCA, "computer-applications", "lg:col-span-6", "emerald")}
                {renderBentoBox("Club Leadership", mappedClubLeadership, "club-leadership", "lg:col-span-4", "amber")}
                {renderBentoBox("Faculty / Mentors", mappedFacultyMentors, "faculty-mentors", "lg:col-span-8", "purple")}
              </div>

              <div id="team-members" className="flex flex-col gap-14 w-full pt-10 border-t border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                  <div>
                    <h2 className="text-3xl font-display font-black text-text uppercase tracking-tight">Team Members</h2>
                    <p className="text-sm text-text-muted mt-1">Select an academic year to view the roster.</p>
                  </div>
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
                {members.length === 0 ? (
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
                  <>
                    {renderTeamSection("Admin Team", adminTeam)}
                    {renderTeamSection("Core Team", coreTeam)}
                    {renderTeamSection("Tech Team", techTeam)}
                    {renderTeamSection("Graphic & Media Team", graphicTeam)}
                  </>
                )}
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
};

export default Team;
