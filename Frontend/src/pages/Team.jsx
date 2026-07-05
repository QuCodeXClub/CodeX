import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, User, Loader2 } from 'lucide-react';
const MemberCard = ({ member }) => {
  const generateEmail = (name) => {
    return `${name.split(' ')[0].toLowerCase()}@codex.org`;
  };

  return (
    <div className="w-full sm:w-[280px] bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1">
      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#Faf9f6] border-2 border-gray-100 flex items-center justify-center">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-8 h-8 text-gray-300" />
        )}
      </div>
      <div className="flex flex-col overflow-hidden">
        <h3 className="text-[#0a0a0a] font-bold text-sm truncate">{member.name}</h3>
        <p className="text-gray-500 text-xs truncate mb-1">{member.post}</p>
        <a 
          href={`mailto:${generateEmail(member.name)}`} 
          className="text-[#2ec5d4] text-[10px] flex items-center gap-1.5 hover:underline truncate font-bold tracking-wider"
        >
          <Mail className="w-3 h-3" />
          {generateEmail(member.name)}
        </a>
      </div>
    </div>
  );
};
const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get('/api/v1/teams');
        setMembers(response.data?.data || []);
      } catch (err) {
        setError('Failed to load team data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);
  const techTeam = members.filter(m => m.subTeam?.toLowerCase().includes('tech'));
  const coreTeam = members.filter(m => m.subTeam?.toLowerCase().includes('core') && !m.subTeam?.toLowerCase().includes('tech'));
  const leadershipUnsorted = members.filter(m => 
    !m.subTeam?.toLowerCase().includes('tech') && 
    !m.subTeam?.toLowerCase().includes('core')
  );
  const getHierarchyWeight = (post) => {
    const p = post.toLowerCase();
    if (p.includes('faculty')) return 1;
    if (p.includes('president') && !p.includes('vice')) return 2;
    if (p.includes('vice president')) return 3;
    if (p.includes('coordinator')) return 4;
    if (p.includes('lead')) return 5;
    if (p.includes('manager')) return 6;
    return 99; 
  };

  const leadership = [...leadershipUnsorted].sort((a, b) => 
    getHierarchyWeight(a.post) - getHierarchyWeight(b.post)
  );

  return (
    <div className="team-page min-h-screen bg-[#Faf9f6] relative font-jetbrains selection:bg-[#2ec5d4] selection:text-white pb-24">
            <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 lg:pt-24">
                <div className="mb-20 text-center md:text-left">
          <p className="text-[#2ec5d4] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
           TEAM_STRUCTURE
          </p>
          <h1 className="font-oswald text-6xl md:text-7xl font-bold uppercase text-[#0a0a0a] mb-4 tracking-tight">
            CORE TEAM
          </h1>
          <p className="text-gray-500 font-medium">
            Meet the people driving Codex forward.
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-[#2ec5d4] mb-4" />
            <span className="font-bold uppercase tracking-widest text-gray-500 text-sm">
              Loading Roster...
            </span>
          </div>
        ) : error ? (
          <div className="text-red-500 font-bold uppercase tracking-widest text-center py-20">{error}</div>
        ) : (
          <div className="flex flex-col gap-20 items-center">
                        {leadership.length > 0 && (
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 w-full max-w-4xl">
                {leadership.map((member) => (
                  <div key={member._id} className="flex flex-col items-center">
                    <span className="text-[#2ec5d4] text-[10px] font-bold uppercase tracking-[0.15em] mb-3 text-center h-4">
                      {member.post}
                    </span>
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>
            )}
            {techTeam.length > 0 && (
              <div className="w-full flex flex-col items-center pt-8">
                <h2 className="text-[#2ec5d4] text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-center border-b border-gray-200 pb-2 px-8">
                  TECH TEAM MEMBERS
                </h2>
                <div className="flex flex-wrap justify-center gap-6 w-full">
                  {techTeam.map((member) => (
                    <MemberCard key={member._id} member={member} />
                  ))}
                </div>
              </div>
            )}
            {coreTeam.length > 0 && (
              <div className="w-full flex flex-col items-center pt-8">
                <h2 className="text-[#2ec5d4] text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-center border-b border-gray-200 pb-2 px-8">
                  CORE TEAM MEMBERS
                </h2>
                <div className="flex flex-wrap justify-center gap-6 w-full">
                  {coreTeam.map((member) => (
                    <MemberCard key={member._id} member={member} />
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