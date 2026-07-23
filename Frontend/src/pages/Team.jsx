import React, { useState, useEffect } from "react";
import { Filter, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminTeam } from "../context/adminTeamSlice";
import { AdminTeamCardSkeleton } from "../components/common/skeletons";
import { TeamMemberCard } from "../components/common/TeamMemberCard";
import { generateAcademicYears } from "../utils/helpers";
const formAcademicYears = generateAcademicYears();

const Team = () => {
  const dispatch = useDispatch();
  const { members, loading } = useSelector((state) => state.adminTeam);
  const [filterYear, setFilterYear] = useState(formAcademicYears[0]);

  useEffect(() => {
    if (filterYear) {
      dispatch(fetchAdminTeam(filterYear));
    }
  }, [dispatch, filterYear]);
  const displayedMembers = [...members].sort(
    (a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0)
  );

  const adminTeam = displayedMembers.filter((m) => m.subTeam === "Admin Team");
  const coreTeam = displayedMembers.filter((m) => m.subTeam === "Core Team");
  const techTeam = displayedMembers.filter((m) => m.subTeam === "Tech Team");
  const graphicTeam = displayedMembers.filter(
    (m) => m.subTeam === "Graphic Team"
  );

  return (
    <div className="team-page min-h-screen bg-bg-soft relative font-jetbrains selection:bg-accent selection:text-white pb-24">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10  mx-auto px-6 pt-8 lg:pt-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight">
              Codex Team
            </h1>
            <p className="text-sm text-text-text-muted mt-1">
              Meet the people driving Codex forward.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer w-full"
              >
                {formAcademicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-gray-400 pointer-events-none"></div>
            </div>
          </div>
        </header>
        {loading ? (
          <div className="flex flex-col gap-16 w-full">
            <div className="w-full">
              <div className="flex items-center gap-4 mb-6 w-full">
                <h2 className="text-xl font-bold text-text-text-muted tracking-tight">
                  Loading Roster...
                </h2>
                <div className="flex-1 h-px bg-card-hover"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <AdminTeamCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm w-full">
            <Users className="w-12 h-12 text-text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text mb-1">
              No Team Members Found
            </h3>
            <p className="text-text-text-muted text-sm">
              There are no team records available for the selected academic
              year.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-16 w-full">
            {adminTeam.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-4 mb-6 w-full">
                  <h2 className="text-xl font-bold text-text tracking-tight">
                    Admin Team
                  </h2>
                  <div className="flex-1 h-px bg-card-hover"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-[1920px]">
                  {adminTeam.map((member) => (
                    <div
                      key={member._id}
                      className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] 2xl:w-[calc(14.28%-20.5px)] max-w-[240px]"
                    >
                      <TeamMemberCard member={member} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {coreTeam.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-4 mb-6 w-full">
                  <h2 className="text-xl font-bold text-text tracking-tight">
                    Core Team
                  </h2>
                  <div className="flex-1 h-px bg-card-hover"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-[1920px]">
                  {coreTeam.map((member) => (
                    <div
                      key={member._id}
                      className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] 2xl:w-[calc(14.28%-20.5px)] max-w-[240px]"
                    >
                      <TeamMemberCard member={member} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {techTeam.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-4 mb-6 w-full">
                  <h2 className="text-xl font-bold text-text tracking-tight">
                    Tech Team
                  </h2>
                  <div className="flex-1 h-px bg-card-hover"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-[1920px]">
                  {techTeam.map((member) => (
                    <div
                      key={member._id}
                      className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] 2xl:w-[calc(14.28%-20.5px)] max-w-[240px]"
                    >
                      <TeamMemberCard member={member} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {graphicTeam.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-4 mb-6 w-full">
                  <h2 className="text-xl font-bold text-text tracking-tight">
                    Graphic Team
                  </h2>
                  <div className="flex-1 h-px bg-card-hover"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-[1920px]">
                  {graphicTeam.map((member) => (
                    <div
                      key={member._id}
                      className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] 2xl:w-[calc(14.28%-20.5px)] max-w-[240px]"
                    >
                      <TeamMemberCard member={member} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
