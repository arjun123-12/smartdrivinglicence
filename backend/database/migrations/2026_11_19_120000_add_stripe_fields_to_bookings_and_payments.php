<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('bookings') && !Schema::hasColumn('bookings', 'expires_at')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dateTime('expires_at')->nullable()->after('payment_status');
            });
        }

        if (Schema::hasTable('payments')) {
            Schema::table('payments', function (Blueprint $table) {
                if (!Schema::hasColumn('payments', 'stripe_session_id')) {
                    $table->string('stripe_session_id')->nullable()->index()->after('transaction_id');
                }
                if (!Schema::hasColumn('payments', 'idempotency_key')) {
                    $table->string('idempotency_key')->nullable()->after('stripe_session_id');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('bookings') && Schema::hasColumn('bookings', 'expires_at')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('expires_at');
            });
        }

        if (Schema::hasTable('payments')) {
            Schema::table('payments', function (Blueprint $table) {
                $dropCols = [];
                if (Schema::hasColumn('payments', 'stripe_session_id')) {
                    $dropCols[] = 'stripe_session_id';
                }
                if (Schema::hasColumn('payments', 'idempotency_key')) {
                    $dropCols[] = 'idempotency_key';
                }
                if (!empty($dropCols)) {
                    $table->dropColumn($dropCols);
                }
            });
        }
    }
};
