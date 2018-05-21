% 

% NON-EQUAL SSD

% distinct correct:

% distinct correct:
valuesA = [0.0028100562598099505,0.003774659534869852,0.004011153076630522,0.004128099243738105,0.004349689553821321,0.004752894129831989,0.005065002925442772,0.005206789277236324,0.005464400692464932,0.0080743016152797];
% distinct incorrect:
valuesB = [0.0030352218172936766,0.0034860108082508516,0.003593277086849832,0.003695311068380251,0.009440202882522689,0.018418134154931758];



% indistinct correct:
valuesC = [0.00003955418990502002,0.0000400752108782042,0.00004795482174241996,0.000053672712743107586,0.00005470107757884075,0.000056003454328321965,0.00005731807637697606,0.0000575550037615014,0.000059422744168486634,0.00006233010696621352,0.00006564508739462862,0.0004126700723346651,0.0004138851262517734,0.0004225459742358198,0.0004238180443171875,0.00042534335123987145];
% indistinct wrong:
valuesD = [0.0004590314212755639,0.0012452151360011297];


% noise correct:
valuesE = [0.0018513986052052758,0.0019211594473427668,0.0019694467027228857,0.0019740918777036765,0.0020517543351960673,0.002068063168684686,0.0021365525449123135,0.0021668597200986926,0.002244926422747826,0.0022573935918975183,0.0024256332539328946,0.002425686819883587,0.0024646202620795285,0.002498225818967902,0.002540691416356065,0.0027241546670839357,0.0027401077844252004,0.002784097151903217,0.002983329526513176,0.003027889585892698,0.0031676708480888344,0.0032066603414087477,0.0032862551337343353,0.003318021662549105,0.0034396472904661885,0.0038270171264645687,0.004025764660331023,0.004045912147615497,0.004385237025331834];
% noise wrong:
valuesF = [0.004201402718229138,0.005451681506269127,0.005598569459799895,0.005825827115080679,0.006099674120653468,0.006841562259642218,0.01333254145550304];



hold off;
plot( valuesA, 'r-' );
hold on;
%plot( values0, 'r-' );

plot( valuesC, 'm-' );
plot( valuesE, 'm-' );

plot( valuesB, 'b-' );
plot( valuesD, 'b-' );
plot( valuesF, 'b-' );






