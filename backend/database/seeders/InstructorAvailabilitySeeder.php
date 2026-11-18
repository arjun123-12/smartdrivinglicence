<?php

namespace Database\Seeders;

use App\Models\Instructor;
use App\Models\InstructorAvailability;
use App\Models\Location;
use Illuminate\Database\Seeder;

class InstructorAvailabilitySeeder extends Seeder
{
    /**
     * Ensure all active instructors have 7-day availabilities and coverage for all Adelaide locations.
     */
    public function run(): void
    {
        $instructors = Instructor::where('is_active', true)->get();
        $locationIds = Location::pluck('id')->toArray();

        foreach ($instructors as $inst) {
            // 7 days of availability (Day 0 Sunday through Day 6 Saturday)
            for ($day = 0; $day <= 6; $day++) {
                InstructorAvailability::updateOrCreate(
                    [
                        'instructor_id' => $inst->id,
                        'day_of_week' => $day,
                    ],
                    [
                        'start_time' => '08:00:00',
                        'end_time' => '17:30:00',
                        'is_active' => true,
                    ]
                );
            }

            // Sync all locations so no suburb or test centre returns 0 slots
            if (!empty($locationIds)) {
                $inst->locations()->sync($locationIds);
            }
        }
    }
}
