


"use client";

import React from "react";
import { bloodAnalysisData } from "@/library/reportTable";

const BloodTable = ({patientId, sampleType}) => {
  return (
    <div className="p-4 max-w-md mx-auto border border-gray-300 rounded-b-lg bg-white">
      {/* RBC Table */}
      <div className=" flex justify-between pb-2">
                <div className="px-2">Patient ID: {patientId}</div>
                <div className="pr-5">Sample Type: {sampleType}</div> 
              </div>
      <h2 className="text-center font-bold bg-green-100 py-1">RBC</h2>
      <table className="w-full border border-collapse mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-1">Type</th>
            <th className="border p-1">Count</th>
            <th className="border p-1">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {bloodAnalysisData.RBC.map((item, index) => (
            <tr key={index}>
              <td className="border p-1">{item.type}</td>
              <td className="border p-1 text-center">{item.count}</td>
              <td className="border p-1 text-center">{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* WBC Table */}
      <h2 className="text-center font-bold bg-green-100 py-1">WBC</h2>
      <table className="w-full border border-collapse mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-1">Type</th>
            <th className="border p-1">Count</th>
            <th className="border p-1">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {bloodAnalysisData.WBC.map((item, index) => (
            <tr key={index}>
              <td className="border p-1">{item.type}</td>
              <td className="border p-1 text-center">{item.count}</td>
              <td className="border p-1 text-center">{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Platelets */}
      <h2 className="text-center font-bold bg-green-100 py-1">Platelets</h2>
      <table className="w-full border border-collapse">
        <tbody>
          <tr>
            <td className="border p-1">Count</td>
            <td className="border p-1 text-center" colSpan={2}>
              {bloodAnalysisData.Platelets.count}
            </td>
          </tr>
          <tr>
            <td className="border p-1">Percentage</td>
            <td className="border p-1 text-center" colSpan={2}>
              {bloodAnalysisData.Platelets.percentage}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BloodTable;
