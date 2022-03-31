//
//  NoDataView.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 1/28/22.
//

import UIKit

class NoDataView: UIView {

    
    var view: UIView!
    
    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var descLabel: UILabel!
    @IBOutlet var accommLabel: UILabel!
    @IBOutlet var ratingLabel:UILabel!
    @IBOutlet var countLabel: UILabel!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupView()
    }
    
    func loadViewFromNib() -> UIView {
        let nib = UINib(nibName: "NoDataView", bundle: Bundle.main)
        let view = nib.instantiate(withOwner: self, options: nil) [0] as! UIView
        return view
    }
    
    func setupView() {
        view = loadViewFromNib()
        view.frame = bounds
        view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(view)
    }
                                                          // formerly Double; formerly Int
    func set(title: String, desc: String, accomm: String, rating: String, count: String) {
        titleLabel.text = title
        descLabel.text = desc
        accommLabel.text = accomm
        ratingLabel.text = rating //.description  // Just need an Int versioned UILabel member;
                                   // might have to change this to text along with argument Ints  -> String;
                                   // this would require us to change rating_value -> String & rating_count -> String
        countLabel.text = count //.description
    }
}
