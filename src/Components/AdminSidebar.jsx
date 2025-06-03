// // AdminSidebar.js
// function AdminSidebar({ activeSection, setActiveSection }) {
//   return (
//     <div className="w-64 bg-white shadow-lg">
//       <nav className="p-4">
//         <h2 className="text-lg font-semibold mb-4">Menu</h2>
//         <ul className="space-y-2">
//           <li>
//             <button 
//               onClick={() => setActiveSection('modify-profiles')}
//               className={`w-full text-left p-2 rounded ${activeSection === 'modify-profiles' ? 'bg-blue-100' : ''}`}
//             >
//               Modify Profiles
//             </button>
//             {activeSection === 'modify-profiles' && (
//               <ul className="ml-4 mt-1 space-y-1">
//                 <li>Participants</li>
//                 <li>Coaches</li>
//                 <li>Team Leaders</li>
//               </ul>
//             )}
//           </li>
//           <li>
//             <button 
//               onClick={() => setActiveSection('approve-registrations')}
//               className={`w-full text-left p-2 rounded ${activeSection === 'approve-registrations' ? 'bg-blue-100' : ''}`}
//             >
//               Approve Registrations
//             </button>
//           </li>
//           {/* Add other main menu items similarly */}
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default AdminSidebar