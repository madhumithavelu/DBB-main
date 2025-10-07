// import React, { useState } from 'react';
// import { X, Calendar, Clock, FileText } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

// export function CreateSessionModal({ onClose, onSuccess }) {
//   const { createSession } = useAuth();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     startTime: '',
//     duration: 60,
//     classLink: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const sessionData = {
//       ...formData,
//       startTime: new Date(formData.startTime),
//       trainees: []
//     };
    
//     createSession(sessionData);
//     onSuccess();
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-white">Create New Session</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition-colors duration-200"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Session Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
//               placeholder="Enter session title"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={3}
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
//               placeholder="Enter session description"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Start Date & Time
//             </label>
//             <input
//               type="datetime-local"
//               name="startTime"
//               value={formData.startTime}
//               onChange={handleChange}
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Duration (minutes)
//             </label>
//             <input
//               type="number"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               min="15"
//               max="480"
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Class Link (Optional)
//             </label>
//             <input
//               type="url"
//               name="classLink"
//               value={formData.classLink}
//               onChange={handleChange}
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
//               placeholder="https://meet.google.com/..."
//             />
//           </div>

//           <div className="flex space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
//             >
//               Create Session
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function CreateSessionModal({ onClose, onSuccess }) {
  const { createSession } = useAuth();


  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("createSessionForm");
    return saved
      ? JSON.parse(saved)
      : {
          title: '',
          description: '',
          startTime: '',
          duration: 60,
          classLink: ''
        };
  });


  useEffect(() => {
    localStorage.setItem("createSessionForm", JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const sessionData = {
      ...formData,
      startTime: new Date(formData.startTime),
      trainees: []
    };

    createSession(sessionData);
    onSuccess();


    localStorage.removeItem("createSessionForm");
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Enter session title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Enter session description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="15"
              max="480"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Class Link (Optional)
            </label>
            <input
              type="url"
              name="classLink"
              value={formData.classLink}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}