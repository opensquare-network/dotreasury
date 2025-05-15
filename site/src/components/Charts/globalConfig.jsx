import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  RadialLinearScale,
} from "chart.js";
import "./adapterDayjs";
import gradient from "chartjs-plugin-gradient";

Chart.defaults.font.family = "Inter";

Chart.register(
  gradient,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
  Filler,
  ArcElement,
  BarElement,
  Legend,
  RadialLinearScale,
);
