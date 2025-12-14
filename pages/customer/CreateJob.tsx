import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../App';
import { Button } from '../../components/Button';
import { Input, TextArea } from '../../components/Input';
import { JOB_CATEGORIES } from '../../constants';
import { MapPin, Camera, X, Car, Wrench, ChevronDown } from 'lucide-react';

interface CreateJobProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateJob: React.FC<CreateJobProps> = ({ onCancel, onSuccess }) => {
  const { createJob, currentUser, jobs } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: JOB_CATEGORIES[0],
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleRego: '',
    description: '',
    location: '',
    photos: [] as string[]
  });

  // Extract unique vehicles from customer's job history for the "My Garage" dropdown
  const savedVehicles = useMemo(() => {
    if (!currentUser) return [];
    
    const userJobs = jobs.filter(j => j.customerId === currentUser.id);
    const uniqueMap = new Map<string, {make: string, model: string, year: string, rego: string}>();
    
    userJobs.forEach(j => {
      // Create a unique key for the vehicle
      const key = `${j.vehicleYear}-${j.vehicleMake}-${j.vehicleModel}-${j.vehicleRego || ''}`.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          make: j.vehicleMake,
          model: j.vehicleModel,
          year: j.vehicleYear,
          rego: j.vehicleRego || ''
        });
      }
    });
    
    return Array.from(uniqueMap.values());
  }, [jobs, currentUser]);

  const handleSavedVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'NEW') {
        // Clear fields for new vehicle
        setFormData(prev => ({
            ...prev,
            vehicleMake: '',
            vehicleModel: '',
            vehicleYear: '',
            vehicleRego: ''
        }));
    } else {
        // Auto-fill selected vehicle
        const index = parseInt(value);
        const v = savedVehicles[index];
        if (v) {
            setFormData(prev => ({
                ...prev,
                vehicleMake: v.make,
                vehicleModel: v.model,
                vehicleYear: v.year,
                vehicleRego: v.rego
            }));
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      createJob(formData);
      setLoading(false);
      onSuccess();
    }, 800);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({ ...prev, location: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}` }));
      }, () => {
        alert("Could not access location");
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Explicitly cast to File[] to avoid 'unknown' type inference issue
      const files = Array.from(e.target.files) as File[];
      const remainingSlots = 3 - formData.photos.length;
      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
           setFormData(prev => ({
             ...prev,
             photos: [...prev.photos, reader.result as string]
           }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
      setFormData(prev => ({
          ...prev,
          photos: prev.photos.filter((_, i) => i !== index)
      }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Improved Header Logo */}
      <div className="flex flex-col items-center mb-8">
         <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-50 to-white rounded-full flex items-center justify-center border border-blue-100 shadow-inner mb-4">
             <Car className="w-9 h-9 text-primary opacity-80" />
             <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md border border-blue-50">
                <div className="bg-secondary rounded-full p-1">
                    <Wrench className="w-3.5 h-3.5 text-white" />
                </div>
             </div>
         </div>
         <h2 className="text-xl font-bold text-gray-900">Request a Mechanic</h2>
         <p className="text-sm text-gray-500">Describe your issue to get help.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-primary mb-2 font-mono">Job Category</label>
          <div className="relative">
              <select 
                className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none font-medium transition-colors"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={{ backgroundImage: 'none' }}
              >
                {JOB_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                 <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
          </div>
        </div>

        {/* Improved My Garage Selector */}
        {savedVehicles.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group">
             {/* Decorative top bar */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20"></div>
             
             <div className="flex items-center gap-2 mb-3">
                 <div className="bg-primary/10 p-1.5 rounded-md">
                     <Car className="w-4 h-4 text-primary" />
                 </div>
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select from Garage</span>
             </div>
             
             <div className="relative">
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm appearance-none font-medium transition-colors cursor-pointer hover:bg-white hover:border-gray-300"
                    onChange={handleSavedVehicleChange}
                    defaultValue="NEW"
                    style={{ backgroundImage: 'none' }}
                 >
                     <option value="NEW" className="text-gray-500">-- Choose a saved vehicle --</option>
                     {savedVehicles.map((v, idx) => (
                         <option key={idx} value={idx} className="text-gray-900 font-medium">
                            {v.year} {v.make} {v.model} {v.rego ? `(${v.rego})` : ''}
                         </option>
                     ))}
                     <option value="NEW" className="text-primary font-bold">+ Enter New Vehicle</option>
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-primary" />
                 </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Input 
            label="Year" 
            placeholder="2018" 
            value={formData.vehicleYear}
            onChange={e => setFormData({...formData, vehicleYear: e.target.value})}
            required
          />
          <Input 
            label="Make" 
            placeholder="Toyota" 
            className="col-span-2"
            value={formData.vehicleMake}
            onChange={e => setFormData({...formData, vehicleMake: e.target.value})}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
            <Input 
                label="Model" 
                placeholder="Corolla" 
                value={formData.vehicleModel}
                onChange={e => setFormData({...formData, vehicleModel: e.target.value})}
                required
            />
            <Input 
                label="Rego (Optional)" 
                placeholder="S123-ABC" 
                value={formData.vehicleRego}
                onChange={e => setFormData({...formData, vehicleRego: e.target.value.toUpperCase()})}
            />
        </div>

        <TextArea 
          label="What seems to be the problem?" 
          placeholder="Describe the issue, noise, or service needed..."
          rows={3}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          required
        />

        {/* Photo Upload Section */}
        <div>
           <label className="block text-sm font-bold text-gray-800 mb-2 font-mono">Photos (Optional)</label>
           <div className="flex gap-3 overflow-x-auto pb-2">
               {/* Previews */}
               {formData.photos.map((photo, idx) => (
                  <div key={idx} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200 group">
                     <img src={photo} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                     <button 
                        type="button" 
                        onClick={() => removePhoto(idx)} 
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X size={12} />
                     </button>
                  </div>
               ))}
               
               {/* Upload Button */}
               {formData.photos.length < 3 && (
                 <label className="w-24 h-24 shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-black transition-colors">
                    <Camera className="w-6 h-6 text-gray-400" />
                    <span className="text-[10px] text-gray-500 mt-1 font-bold">ADD PHOTO</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                 </label>
               )}
           </div>
           <p className="text-xs text-gray-500 mt-1">Upload up to 3 photos of the damage or part.</p>
        </div>

        <div className="relative">
          <Input 
            label="Location" 
            placeholder="123 King William St, Adelaide" 
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            required
          />
          <button 
            type="button"
            onClick={handleGeolocation}
            className="absolute right-2 top-8 p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Use my location"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" fullWidth onClick={onCancel}>Cancel</Button>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
};