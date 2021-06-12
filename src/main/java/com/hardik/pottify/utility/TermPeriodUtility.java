package com.hardik.pottify.utility;

public class TermPeriodUtility {

	public static String getTerm(final Integer term) {
		if (term == 0) {
			return "Past Month";
		} else if (term == 1) {
			return "Past 6 Months";
		} else {
			return "All Time";
		}
	}
}
