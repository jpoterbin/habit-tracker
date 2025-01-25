import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';
import { storage } from '../utils/storage';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get the current week key for storing/retrieving data
  const getCurrentWeekKey = (date) => {
    return format(startOfWeek(date), 'yyyy-MM-dd');
  };

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = storage.load();
    console.log('Initial load - savedHabits:', savedHabits); // Debug log
    if (savedHabits && Array.isArray(savedHabits)) { // Add type check
      console.log('Setting habits state with:', savedHabits);
      setHabits(savedHabits);
    } else {
      console.log('No valid habits found in storage');
      setHabits([]); // Ensure we have an empty array if no valid data
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) { // Only save if we have habits
      console.log('Saving habits to storage:', habits);
      storage.save(habits);
    }
  }, [habits]);

  // Add a debug function to check localStorage directly
  const debugStorage = () => {
    const rawData = localStorage.getItem('habit-tracker-data');
    console.log('Raw localStorage data:', rawData);
    try {
      const parsedData = JSON.parse(rawData);
      console.log('Parsed localStorage data:', parsedData);
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }
  };

  // Call debugStorage when adding a habit
  const addHabit = () => {
    if (newHabit.trim()) {
      const newHabitsList = [...habits, { 
        id: Date.now(),
        name: newHabit,
        completionData: {}
      }];
      console.log('Adding new habit, updated list:', newHabitsList);
      setHabits(newHabitsList);
      setNewHabit('');
      debugStorage(); // Check storage after adding
    }
  };

  const toggleDay = (habitIndex, dayIndex) => {
    const weekKey = getCurrentWeekKey(currentWeek);
    const newHabits = [...habits];
    const habit = newHabits[habitIndex];
    
    // Initialize completion data for this week if it doesn't exist
    if (!habit.completionData[weekKey]) {
      habit.completionData[weekKey] = new Array(7).fill(false);
    }
    
    // Toggle the completion state
    habit.completionData[weekKey][dayIndex] = !habit.completionData[weekKey][dayIndex];
    setHabits(newHabits);
  };

  const removeHabit = (index) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const previousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const getCompletionData = (habit, weekKey = getCurrentWeekKey(currentWeek)) => {
    return habit.completionData[weekKey] || new Array(7).fill(false);
  };

  const weekDisplay = format(currentWeek, 'MMM d, yyyy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Container with responsive padding */}
        <div className="max-w-3xl mx-auto">
          {/* Header with week navigation */}
          <div className="flex items-center justify-between mb-6 px-2">
            <button 
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
              onClick={previousWeek}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-900">{weekDisplay}</h1>
            <button 
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
              onClick={nextWeek}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Habit input - responsive width and padding */}
          <div className="mb-6 px-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Add new habit..."
                className="flex-1 px-4 py-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-400 outline-none bg-white bg-opacity-70"
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              />
              <button
                onClick={addHabit}
                className="px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
                aria-label="Add habit"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          {/* Days of the week - responsive text size */}
          <div className="flex justify-between mb-4 bg-white bg-opacity-40 rounded-lg p-2 px-4">
            {days.map((day, index) => (
              <div key={day} className="text-center flex-1">
                <div className="text-xs md:text-sm font-semibold text-indigo-900">{day}</div>
                <div className="text-xs md:text-sm text-indigo-600">
                  {format(addDays(startOfWeek(currentWeek), index), 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Habits list - responsive grid for larger screens */}
          <div className="space-y-4">
            {habits.map((habit, habitIndex) => (
              <div 
                key={habit.id} 
                className="bg-white bg-opacity-40 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm md:text-base text-indigo-900">{habit.name}</span>
                  <button
                    onClick={() => removeHabit(habitIndex)}
                    className="text-red-400 p-1 hover:text-red-600 transition-colors"
                    aria-label="Remove habit"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex justify-between gap-1 md:gap-2">
                  {getCompletionData(habit).map((completed, dayIndex) => (
                    <button
                      key={dayIndex}
                      onClick={() => toggleDay(habitIndex, dayIndex)}
                      className={`flex-1 aspect-square rounded-lg transition-all duration-200
                        ${completed 
                          ? 'bg-gradient-to-br from-indigo-400 to-purple-400 shadow-sm' 
                          : 'border-2 border-indigo-200 bg-white bg-opacity-50 hover:border-indigo-300'
                        }`}
                      aria-label={`Mark ${habit.name} for ${days[dayIndex]}`}
                      aria-pressed={completed}
                    >
                      {completed && (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {habits.length === 0 && (
              <div className="text-center text-indigo-400 py-8 italic">
                Add your first habit to get started...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker; 