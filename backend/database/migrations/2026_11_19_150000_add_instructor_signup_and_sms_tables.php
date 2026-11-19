<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Additive fields on instructors table
        Schema::table('instructors', function (Blueprint $table) {
            if (!Schema::hasColumn('instructors', 'experience_years')) {
                $table->unsignedSmallInteger('experience_years')->nullable()->after('bio');
            }
            if (!Schema::hasColumn('instructors', 'car_make')) {
                $table->string('car_make', 100)->nullable()->after('car_transmission');
            }
            if (!Schema::hasColumn('instructors', 'car_rego')) {
                $table->string('car_rego', 50)->nullable()->after('car_dual_controls');
            }
            if (!Schema::hasColumn('instructors', 'doc_wwcc_path')) {
                $table->string('doc_wwcc_path', 255)->nullable()->after('examiner_accreditation_no');
            }
            if (!Schema::hasColumn('instructors', 'doc_licence_path')) {
                $table->string('doc_licence_path', 255)->nullable()->after('doc_wwcc_path');
            }
            if (!Schema::hasColumn('instructors', 'doc_permit_path')) {
                $table->string('doc_permit_path', 255)->nullable()->after('doc_licence_path');
            }
            if (!Schema::hasColumn('instructors', 'phone_verified_at')) {
                $table->timestamp('phone_verified_at')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('instructors', 'admin_feedback')) {
                $table->text('admin_feedback')->nullable()->after('verification_status');
            }
        });

        // 2. Additive fields on users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phone_verified_at')) {
                $table->timestamp('phone_verified_at')->nullable()->after('email_verified_at');
            }
        });

        // 3. SMS OTPs table for phone verification and SMS login
        if (!Schema::hasTable('sms_otps')) {
            Schema::create('sms_otps', function (Blueprint $table) {
                $table->id();
                $table->string('phone', 30)->index();
                $table->string('otp_code', 100);
                $table->string('purpose', 50)->index(); // 'instructor_signup', 'instructor_login'
                $table->timestamp('expires_at')->nullable();
                $table->unsignedTinyInteger('attempts')->default(0);
                $table->timestamp('resend_after')->nullable();
                $table->boolean('is_used')->default(false)->index();
                $table->timestamps();
            });
        }

        // 4. Ensure all existing instructors with verification_status 'verified' have phone_verified_at set
        DB::table('instructors')
            ->whereIn('verification_status', ['verified', 'approved'])
            ->whereNull('phone_verified_at')
            ->update(['phone_verified_at' => now()]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_otps');

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'phone_verified_at')) {
                $table->dropColumn('phone_verified_at');
            }
        });

        Schema::table('instructors', function (Blueprint $table) {
            $cols = [
                'experience_years',
                'car_make',
                'car_rego',
                'doc_wwcc_path',
                'doc_licence_path',
                'doc_permit_path',
                'phone_verified_at',
                'admin_feedback',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('instructors', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
