import {
  CheckCircle2,
  ChevronRight,
  Star,
  Wifi,
  XCircle,
  Zap,
} from "lucide-react";

import {
  BILLING_PAYMENT_METHODS,
} from "../model/billing-orders.constants";
import {
  formatBillingOrderCurrency,
} from "../model/billing-orders.utils";
import type { useBillingOrders } from "../hooks/use-billing-orders";

function StepIndicator({
  currentStep,
  stepNumber,
  label,
}: {
  currentStep: number;
  stepNumber: number;
  label: string;
}) {
  const isActive = currentStep >= stepNumber;
  const isDone = currentStep > stepNumber;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
          isActive ? "bg-[#059669] text-white" : "bg-slate-100 text-slate-400"
        }`}
      >
        {isDone ? <CheckCircle2 size={12} strokeWidth={3} /> : stepNumber}
      </div>
      <span
        className={`text-xs font-bold tracking-wide ${
          isActive ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export function BillingOrdersSimulationModal({
  state,
}: {
  state: ReturnType<typeof useBillingOrders>;
}) {
  if (!state.isModalOpen) {
    return null;
  }

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-200">
      <div
        className="animate-in zoom-in-95 relative flex min-h-[600px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl duration-200"
      >
        <button
          type="button"
          onClick={state.closeSimulation}
          className="absolute top-6 right-6 z-20 text-slate-400 transition-colors hover:text-slate-600"
        >
          <XCircle size={20} />
        </button>

        <div className="border-b border-slate-100 px-8 pt-8 pb-6">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-slate-800">
            <Zap size={20} className="fill-current text-[#059669]" /> Simulasi
            Pesanan Baru
          </h2>

          <div className="relative flex items-center justify-between px-2">
            <div className="absolute top-3 right-0 left-0 border-t-2 border-slate-100" />
            <div className="z-10 bg-white pr-2">
              <StepIndicator
                currentStep={state.modalStep}
                stepNumber={1}
                label="Pilih Member"
              />
            </div>
            <div className="z-10 bg-white px-2">
              <StepIndicator
                currentStep={state.modalStep}
                stepNumber={2}
                label="Pilih Guru"
              />
            </div>
            <div className="z-10 bg-white px-2">
              <StepIndicator
                currentStep={state.modalStep}
                stepNumber={3}
                label="Pilih Paket"
              />
            </div>
            <div className="z-10 bg-white pl-2">
              <StepIndicator
                currentStep={state.modalStep}
                stepNumber={4}
                label="Pembayaran"
              />
            </div>
          </div>
        </div>

        <div className="custom-scrollbar flex flex-1 flex-col items-center overflow-y-auto p-8">
          {state.modalStep === 1 ? (
            <div className="animate-in slide-in-from-right-4 w-full duration-300">
              <p className="mb-3 text-sm font-bold text-slate-800">
                Pilih member yang memesan:
              </p>
              <div className="custom-scrollbar h-[300px] space-y-3 overflow-y-auto pr-2">
                {state.members.map((member) => {
                  const isSelected = state.orderDraft.member?.id === member.id;

                  return (
                    <div
                      key={member.id}
                      onClick={() => state.selectMember(member)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-[#059669] bg-emerald-50/50 shadow-sm"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white shadow-sm ${member.avatar_color}`}
                        >
                          {member.initials}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800">
                            {member.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="text-[#059669]" size={20} />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {state.modalStep === 2 ? (
            <div className="animate-in slide-in-from-right-4 w-full duration-300">
              <p className="mb-3 text-sm font-bold text-slate-800">
                Pilih guru:
              </p>
              <div className="custom-scrollbar h-[300px] space-y-3 overflow-y-auto pr-2">
                {state.gurus.map((guru) => {
                  const isSelected = state.orderDraft.guru?.id === guru.id;

                  return (
                    <div
                      key={guru.id}
                      onClick={() => state.selectGuru(guru)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-[#059669] bg-emerald-50/50 shadow-sm"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={guru.avatar_url ?? "/img/profil1.jpg"}
                            alt={guru.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800">
                            {guru.name}
                          </h4>
                          <p className="mt-0.5 text-xs font-bold tracking-wide text-amber-500">
                            <Star
                              size={11}
                              className="mr-1 inline fill-amber-400 text-amber-400"
                            />
                            {guru.rating ?? "0.0"}
                            <span className="ml-1 text-slate-400">
                              - {guru.murid ?? 0} murid
                            </span>
                          </p>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="text-[#059669]" size={20} />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {state.modalStep === 3 ? (
            <div className="animate-in slide-in-from-right-4 w-full duration-300">
              <p className="mb-3 text-sm font-bold text-slate-800">
                Pilih paket dari {state.orderDraft.guru?.name}:
              </p>
              <div className="space-y-2">
                {state.availablePackages.map((pkg) => {
                  const isSelected = state.orderDraft.paket?.name === pkg.name;

                  return (
                    <div
                      key={pkg.name}
                      onClick={() => state.selectPackage(pkg)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 transition-all ${
                        isSelected
                          ? "border-[#059669] bg-emerald-50/50 shadow-sm"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <h4 className="text-sm font-extrabold text-slate-800">
                          {pkg.name}
                        </h4>
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                          {pkg.session}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-black text-[#059669]">
                          {formatBillingOrderCurrency(pkg.price)}
                        </span>
                        {isSelected ? (
                          <CheckCircle2
                            className="text-[#059669]"
                            size={14}
                          />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              {state.orderDraft.paket ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 mt-4 border-t border-slate-100 pt-4">
                  <h4 className="mb-2 text-[11px] font-black tracking-wider text-slate-800 uppercase">
                    Ringkasan
                  </h4>
                  <div className="space-y-1">
                    <div className="flex w-full items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Member</span>
                      <span className="text-slate-700">
                        {state.orderDraft.member?.name}
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Guru</span>
                      <span className="text-slate-700">
                        {state.orderDraft.guru?.name}
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between border-b border-slate-100 pb-1.5 text-xs font-bold">
                      <span className="text-slate-400">Paket</span>
                      <span className="text-slate-700">
                        {state.orderDraft.paket?.name}
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between pt-1 text-sm font-black">
                      <span className="text-slate-800">Total</span>
                      <span className="text-[#059669]">
                        {formatBillingOrderCurrency(
                          state.orderDraft.paket.price,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {state.modalStep === 4 ? (
            <div className="animate-in slide-in-from-right-4 w-full duration-300">
              <p className="mb-4 text-sm font-bold text-slate-600">
                Pilih metode pembayaran:
              </p>
              <div className="space-y-3">
                {BILLING_PAYMENT_METHODS.map((method) => {
                  const isSelected = state.orderDraft.paymentMethod === method;

                  return (
                    <div
                      key={method}
                      onClick={() => state.selectPaymentMethod(method)}
                      className={`cursor-pointer rounded-xl border-2 p-4 text-sm font-extrabold transition-all ${
                        isSelected
                          ? "border-[#059669] bg-emerald-50/50 text-[#059669] shadow-sm"
                          : "border-slate-100 text-slate-700 hover:border-slate-200"
                      }`}
                    >
                      {method}
                    </div>
                  );
                })}
              </div>

              {state.orderDraft.paymentMethod ? (
                <div className="animate-in slide-in-from-bottom-2 mt-8 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-extrabold text-amber-700">
                  <Wifi size={14} className="mt-0.5 shrink-0" />
                  Pesanan simulasi sudah masuk. Pilih metode untuk konfirmasi.
                </div>
              ) : null}
            </div>
          ) : null}

          {state.modalStep === 5 ? (
            <div className="animate-in zoom-in-50 flex h-full w-full flex-col items-center justify-center duration-500">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-[#059669]">
                <CheckCircle2 size={48} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">
                Pembayaran Berhasil!
              </h2>
              <p className="mt-2 max-w-sm text-center font-semibold text-slate-500">
                Pesanan atas nama {state.orderDraft.member?.name} telah diproses
                dan masuk ke dalam sistem.
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 bg-[#fafafa] px-8 py-5">
          {state.modalStep < 5 ? (
            <>
              {state.modalStep > 1 ? (
                <button
                  type="button"
                  onClick={state.goToPreviousStep}
                  className="text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
                >
                  Kembali
                </button>
              ) : (
                <button
                  type="button"
                  onClick={state.closeSimulation}
                  className="text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
                >
                  Batal
                </button>
              )}

              <button
                type="button"
                onClick={() => void state.handleNextStep()}
                disabled={!state.canContinue}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-all ${
                  state.canContinue
                    ? "bg-[#059669] hover:bg-[#047857]"
                    : "cursor-not-allowed bg-emerald-200 opacity-70"
                }`}
              >
                {state.modalStep === 3
                  ? "Pesan Sekarang"
                  : state.modalStep === 4
                    ? "Konfirmasi Bayar"
                    : "Lanjut"}
                {state.modalStep < 4 ? (
                  <ChevronRight size={16} strokeWidth={3} />
                ) : state.modalStep === 4 ? (
                  <CheckCircle2 size={16} strokeWidth={3} />
                ) : null}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={state.closeSimulation}
              className="w-full rounded-full bg-slate-800 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-900"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
