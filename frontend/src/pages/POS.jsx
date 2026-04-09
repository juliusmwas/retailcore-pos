import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Search,
  Trash2,
  Smartphone,
  Banknote,
  Maximize,
  CreditCard,
} from "lucide-react";
import axios from "axios";
export default function POS() {
  const { user, activeBranch } = useAuth();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suspendedSales, setSuspendedSales] = useState([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const API = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  API.interceptors.request.use((config) => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const token = parsed.token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        console.error("Token parsing failed in POS.jsx", e);
      }
    }
    return config;
  });

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cleanQuery = searchQuery.trim();
      if (!cleanQuery) return;

      try {
        const response = await API.get(`/products/search?query=${cleanQuery}`);
        const product = response.data;

        if (product) {
          setCart((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) {
              return prev.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
              );
            }
            return [
              {
                id: product.id,
                name: product.name,
                barcode: product.barcode,
                price: parseFloat(product.sellingPrice) || 0,
                qty: 1,
              },
              ...prev,
            ];
          });
        }
        setSearchQuery("");
      } catch (error) {
        console.error("Search failed:", error);
        setSearchQuery("");
      }
    }
  };

  const generateReceiptPDF = (sale, changeDetails) => {
    const doc = new jsPDF({
      unit: "mm",
      format: [80, 200],
    });

    const pageWidth = 80;
    const margin = 5;
    let currentY = 10;

    // 1. Header (Centered) - Fetching Business Name from Auth Context
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    // This pulls the registered business name from your DB via the user object
    const businessName =
      user?.businessName || user?.business?.name || "RETAILCORE";

    doc.text(businessName.toUpperCase(), pageWidth / 2, currentY, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    currentY += 5;
    doc.text(activeBranch?.name || "Main Branch", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 4;
    doc.text(
      activeBranch?.address || "Nairobi, Kenya",
      pageWidth / 2,
      currentY,
      {
        align: "center",
      },
    );
    currentY += 4;
    doc.text(
      `Tel: ${activeBranch?.phone || "0700000007"}`,
      pageWidth / 2,
      currentY,
      {
        align: "center",
      },
    );

    // 2. Dotted Divider
    currentY += 5;
    doc.setFontSize(10);
    doc.text(
      "..........................................................................",
      margin,
      currentY,
    );

    // 3. Cashier & Meta Info
    currentY += 6;
    doc.setFontSize(9);
    doc.text(`Cashier:`, margin, currentY);
    doc.text(
      `#${user?.id?.substring(0, 3) || "1"}`,
      pageWidth - margin,
      currentY,
      { align: "right" },
    );
    currentY += 4;
    doc.text(`Operator:`, margin, currentY);
    doc.text(
      user?.fullName?.toLowerCase() || "staff",
      pageWidth - margin,
      currentY,
      { align: "right" },
    );

    currentY += 2;
    doc.text(
      "..........................................................................",
      margin,
      currentY,
    );

    // 4. Items Table - Adjusted column widths to prevent overlapping
    const tableRows = sale.items.map((item) => [
      item.product?.name || "Product",
      item.quantity,
      `${item.unitPrice.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: currentY + 2,
      head: [["Name", "Qty", "Price (KES)"]], // Added KES to header to save space in rows
      body: tableRows,
      theme: "plain",
      styles: { fontSize: 8, font: "helvetica", cellPadding: 1 },
      headStyles: { fontStyle: "normal", textColor: [100, 100, 100] },
      columnStyles: {
        0: { cellWidth: 40 }, // Product Name
        1: { cellWidth: 10, halign: "center" }, // Quantity
        2: { cellWidth: 20, halign: "right" }, // Price
      },
      margin: { left: margin, right: margin },
    });

    currentY = doc.lastAutoTable.finalY + 2;
    doc.text(
      "..........................................................................",
      margin,
      currentY,
    );

    // 5. Totals Block
    currentY += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Sub Total", margin, currentY);
    doc.text(
      `${sale.totalAmount.toLocaleString()} KES`,
      pageWidth - margin,
      currentY,
      { align: "right" },
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    currentY += 6;
    doc.text(sale.paymentMethod || "CASH", margin, currentY);
    doc.text(
      `${changeDetails.received.toLocaleString()}`,
      pageWidth - margin,
      currentY,
      { align: "right" },
    );

    currentY += 5;
    doc.text("CHANGE", margin, currentY);
    doc.text(
      `${changeDetails.change.toLocaleString()}`,
      pageWidth - margin,
      currentY,
      { align: "right" },
    );

    // 6. Footer Divider
    currentY += 8;
    doc.text(
      "..........................................................................",
      margin,
      currentY,
    );

    currentY += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("THANK YOU!", pageWidth / 2, currentY, { align: "center" });
    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.text("Glad to see you again!", pageWidth / 2, currentY, {
      align: "center",
    });

    // 7. Save
    doc.save(`${sale.invoiceNo}.pdf`);
  };

  const handleCheckout = async (method) => {
    if (cart.length === 0) return alert("Cart is empty!");

    let amountReceived = total;
    let changeDue = 0;
    let phoneNumber = "";

    if (method === "MPESA") {
      const input = window.prompt("Enter M-PESA Number:", "254");
      if (!input) return;
      phoneNumber = input;
      setIsProcessing(true);
    } else if (method === "CARD") {
      // For CARD, we just notify the cashier to use the terminal
      const confirmCard = window.confirm(
        `Processing CARD payment for ${total.toLocaleString()} KES. Proceed?`,
      );
      if (!confirmCard) return;
      setIsProcessing(true);
    } else if (method === "CASH") {
      const input = window.prompt(
        `Total: ${total.toLocaleString()}. Amount Received:`,
        total,
      );
      if (input === null) return;
      amountReceived = parseFloat(input);
      if (isNaN(amountReceived) || amountReceived < total)
        return alert("Invalid amount!");
      changeDue = amountReceived - total;
    }

    const saleData = {
      branchId: activeBranch?.id,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.qty,
        price: item.price,
      })),
      totalAmount: total,
      subTotal: total,
      paymentMethod: method,
    };

    try {
      // Simulate Terminal Communication Delay for CARD/MPESA
      if (method === "CARD" || method === "MPESA") {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      const response = await API.post("/sales", saleData);

      if (response.status === 201) {
        if (method === "CARD") alert("Card Transaction Approved!");
        if (method === "MPESA") alert("M-PESA Payment Confirmed!");

        generateReceiptPDF(response.data.sale, {
          received: amountReceived,
          change: changeDue,
        });

        setCart([]);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Transaction Failed. Check Terminal Connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ... startCameraScanner and other functions ...
  const startCameraScanner = () => {
    alert("Camera Scanner coming soon! For now, please type and hit Enter.");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // F1: Focus Search Bar
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // F2: Trigger Cash Checkout
      if (e.key === "F2") {
        e.preventDefault();
        handleCheckout("CASH"); // This matches the paymentMethod enum
      }

      if (e.key === "F3") {
        e.preventDefault();
        handleCheckout("MPESA");
      }

      if (e.key === "F4") {
        e.preventDefault();
        handleCheckout("CARD"); // Matches CARD enum in your Prisma schema
      }

      // Inside handleKeyDown
      if (e.key === "F9") {
        e.preventDefault();
        handleSuspendSale();
      }

      if (e.key === "F10") {
        e.preventDefault();
        if (suspendedSales.length > 0) {
          // Recall the last one added
          handleRecallSale(suspendedSales[suspendedSales.length - 1].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Clean up the event listener to prevent memory leaks or duplicate triggers
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, total, activeBranch]); // Include dependencies to ensure handleCheckout uses current state

  const handleSuspendSale = () => {
    if (cart.length === 0) return;

    const newSuspendedSale = {
      id: Date.now(),
      items: [...cart],
      total: total,
      time: new Date().toLocaleTimeString(),
    };

    setSuspendedSales((prev) => [...prev, newSuspendedSale]);
    setCart([]); // Clear the cart for the next customer
    alert("Sale Suspended. You can now serve the next customer.");
  };

  const handleRecallSale = (suspendedId) => {
    const saleToRecall = suspendedSales.find((s) => s.id === suspendedId);
    if (saleToRecall) {
      // If there's already stuff in the cart, warn the cashier
      if (cart.length > 0) {
        const confirmOverwrite = window.confirm(
          "Current cart is not empty. Overwrite with suspended sale?",
        );
        if (!confirmOverwrite) return;
      }

      setCart(saleToRecall.items);
      setSuspendedSales((prev) => prev.filter((s) => s.id !== suspendedId));
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f4f7f6] overflow-hidden font-sans text-slate-900">
      {/* TOP COMPACT BAR */}
      <header className="bg-white border-b px-4 py-2 flex justify-between items-center">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tighter text-blue-700 uppercase">
            {user?.businessName || "RETAILCORE"}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l pl-2 border-slate-200">
            {activeBranch?.name || "Main Station"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            <span className="text-[10px] font-black text-slate-500 uppercase mr-2">
              Status:
            </span>
            <span className="text-[10px] font-black text-green-600 uppercase">
              Online
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* CENTER COLUMN: THE ENGINE */}
        <div className="flex-1 flex flex-col p-2 space-y-2">
          <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200">
            <div className="relative flex items-center">
              {/* SEARCH ICON */}
              <div className="absolute left-4 p-1 bg-slate-100 rounded text-slate-400">
                <Search size={18} />
              </div>

              {/* INPUT - Notice I added pr-40 to prevent text from going under the buttons */}
              <input
                ref={searchInputRef}
                autoFocus
                className="w-full p-4 pl-14 pr-44 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-md text-lg font-medium outline-none transition-all placeholder:text-slate-300"
                placeholder="Scan Barcode or Search (F1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch} // We'll add this logic next!
              />

              {/* ACTION AREA (Right Side) */}
              <div className="absolute right-3 flex items-center gap-3">
                {/* KEYBOARD SHORTCUTS - Hidden on small screens */}
                <div className="hidden md:flex gap-1">
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400 shadow-sm">
                    F1
                  </kbd>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400 shadow-sm">
                    F2
                  </kbd>
                </div>

                {/* THE SCAN BUTTON */}
                <button
                  onClick={startCameraScanner}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  <Maximize size={16} />
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    Open Scanner
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* COMPACT ITEM TABLE */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-slate-300 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-wider text-left">
                      Product Description
                    </th>
                    <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-wider text-center w-24">
                      Qty
                    </th>
                    <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-wider text-right w-32">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-wider text-right w-32">
                      Subtotal
                    </th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.length > 0 ? (
                    cart.map((item, i) => (
                      <tr
                        key={item.id || i}
                        className="hover:bg-blue-50/50 group transition-colors"
                      >
                        <td className="px-4 py-3">
                          {/* Field Mapping: name from Product model */}
                          <p className="font-bold text-slate-800 uppercase">
                            {item.name}{" "}
                            {/* Will now show: FANTA BLACKCURRANT */}
                          </p>
                          {/* Field Mapping: barcode or sku from Product model */}
                          <p className="text-[10px] text-slate-400 font-mono">
                            {item.barcode || item.sku || "No Barcode"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2 bg-slate-50 rounded border border-slate-200 p-1">
                            <button
                              onClick={() => {
                                setCart((prev) =>
                                  prev.map((c) =>
                                    c.id === item.id
                                      ? { ...c, qty: Math.max(1, c.qty - 1) }
                                      : c,
                                  ),
                                );
                              }}
                              className="w-5 h-5 flex items-center justify-center bg-white border rounded text-slate-400 hover:text-blue-600 hover:border-blue-200"
                            >
                              -
                            </button>
                            <span className="font-bold text-slate-700 min-w-[20px] text-center">
                              {item.qty || 1}
                            </span>
                            <button
                              onClick={() => {
                                setCart((prev) =>
                                  prev.map((c) =>
                                    c.id === item.id
                                      ? { ...c, qty: c.qty + 1 }
                                      : c,
                                  ),
                                );
                              }}
                              className="w-5 h-5 flex items-center justify-center bg-white border rounded text-slate-400 hover:text-blue-600 hover:border-blue-200"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {(Number(item.price) || 0).toLocaleString()}{" "}
                          {/* Will now show: 200 */}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-slate-900">
                          {(
                            (Number(item.price) || 0) * (item.qty || 1)
                          ).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() =>
                              setCart((prev) =>
                                prev.filter((c) => c.id !== item.id),
                              )
                            }
                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <div className="flex flex-col items-center opacity-20">
                          <div className="w-16 h-16 border-4 border-dashed border-slate-400 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} />
                          </div>
                          <p className="font-black uppercase tracking-widest text-xs">
                            Waiting for Scan...
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* BLACK BOTTOM SUMMARY */}
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-t border-slate-700">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase">
                    Items
                  </span>
                  <span className="text-xl font-black text-white">
                    {cart.reduce((sum, item) => sum + (item.qty || 0), 0)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
                  Amount Due
                </span>
                <span className="text-4xl font-black text-green-400 tracking-tighter">
                  <span className="text-lg mr-1 text-green-600 font-bold uppercase">
                    KES
                  </span>
                  {(total || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: THE PAY STATION */}
        <aside className="w-72 bg-slate-200/50 p-2 flex flex-col gap-2">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-300 flex-1 flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Payment Methods
            </h2>

            <div className="space-y-2 flex-1">
              {/* CASH BUTTON */}
              <button
                onClick={() => handleCheckout("CASH")}
                className="w-full flex items-center gap-4 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-md active:scale-95"
              >
                <Banknote size={24} />
                <div className="text-left">
                  <p className="text-xs font-black uppercase leading-none">
                    Cash
                  </p>
                  <p className="text-[10px] opacity-70">F2</p>
                </div>
              </button>

              {/* M-PESA BUTTON */}
              <button
                onClick={() => handleCheckout("MPESA")}
                className="w-full flex items-center gap-4 p-4 bg-[#41ab3b] hover:bg-[#368f31] text-white rounded-lg transition-all shadow-md active:scale-95 border-b-4 border-black/20"
              >
                <div className="font-black text-xl italic">M</div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase leading-none">
                    M-PESA STK
                  </p>
                  <p className="text-[10px] opacity-70">F3</p>
                </div>
              </button>

              {/* CARD BUTTON */}
              <button
                onClick={() => handleCheckout("CARD")}
                className="w-full flex items-center gap-4 p-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-all shadow-md active:scale-95"
              >
                <CreditCard size={24} /> {/* Fixed casing here */}
                <div className="text-left">
                  <p className="text-xs font-black uppercase leading-none">
                    Card Payment
                  </p>
                  <p className="text-[10px] opacity-70">F4</p>
                </div>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={handleSuspendSale}
                className="w-full py-3 bg-white border border-slate-300 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Suspend Sale (F9)
              </button>

              {/* RECALL SECTION */}
              {suspendedSales.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                    Suspended Carts
                  </p>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                    {suspendedSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between p-2 bg-orange-50 border border-orange-100 rounded-md shadow-sm"
                      >
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-orange-700">
                            {sale.time}
                          </p>
                          <p className="text-[9px] text-orange-600">
                            {sale.items.length} items •{" "}
                            {sale.total.toLocaleString()} KES
                          </p>
                        </div>
                        <button
                          onClick={() => handleRecallSale(sale.id)}
                          className="px-2 py-1 bg-orange-500 text-white text-[9px] font-bold rounded hover:bg-orange-600 transition-all uppercase"
                        >
                          Recall
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* OPERATOR CARD */}
          <div className="bg-slate-800 p-4 rounded-lg text-white flex items-center gap-3 shadow-inner">
            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center font-black text-sm border border-white/10">
              {getInitials(user?.fullName || user?.username)}
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                {user?.role || "Cashier"}
              </p>
              <p
                className="text-xs font-bold truncate w-28"
                title={user?.fullName}
              >
                {user?.fullName || "Guest User"}
              </p>
            </div>
            {/* Logout Shortcut Indicator */}
            <div className="ml-auto opacity-30 text-[9px] font-bold">L</div>
          </div>
        </aside>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#41ab3b] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-lg text-gray-800">
              Requesting M-PESA Payment...
            </p>
            <p className="text-sm text-gray-500">
              Please ask the customer to enter their PIN
            </p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center flex flex-col items-center gap-4 max-w-xs">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-lg text-gray-800">
              {/* Dynamic message based on state or logic */}
              Processing Payment...
            </p>
            <p className="text-sm text-gray-500">
              Please do not refresh or close the browser until the transaction
              is complete.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
